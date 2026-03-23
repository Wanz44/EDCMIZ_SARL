import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { google } from 'googleapis';
import cookieParser from 'cookie-parser';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

// Initialize Firebase Admin
// Note: In this environment, we might not have a service account key, 
// so we'll try to initialize with project ID.
const adminApp = initializeApp({
  projectId: firebaseConfig.projectId,
});
const db = getFirestore(adminApp);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.APP_URL || 'http://localhost:3000'}/auth/google/callback`
);

const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify'
];

// Gmail OAuth Routes
app.get('/api/auth/google/url', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GMAIL_SCOPES,
    prompt: 'consent'
  });
  res.json({ url });
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    
    // Store tokens in Firestore for the admin
    // We'll use a fixed document ID for simplicity since it's a single-user admin app
    await db.collection('config').doc('gmail_tokens').set(tokens);

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/admin';
            }
          </script>
          <p>Authentification réussie. Cette fenêtre va se fermer.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).send('Erreur d\'authentification');
  }
});

// Gmail API Proxy Routes
async function getGmailClient() {
  const doc = await db.collection('config').doc('gmail_tokens').get();
  if (!doc.exists) {
    throw new Error('Gmail not connected');
  }
  const tokens = doc.data();
  oauth2Client.setCredentials(tokens!);
  
  // Handle token refresh
  oauth2Client.on('tokens', (newTokens) => {
    if (newTokens.refresh_token) {
      db.collection('config').doc('gmail_tokens').update(newTokens as any);
    } else {
      db.collection('config').doc('gmail_tokens').update({
        access_token: newTokens.access_token,
        expiry_date: newTokens.expiry_date,
        token_type: newTokens.token_type,
        scope: newTokens.scope
      } as any);
    }
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

app.get('/api/gmail/messages', async (req, res) => {
  try {
    const gmail = await getGmailClient();
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 20,
      q: req.query.q as string || ''
    });
    
    const messages = await Promise.all(
      (response.data.messages || []).map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!
        });
        return detail.data;
      })
    );
    
    res.json(messages);
  } catch (error: any) {
    console.error('Gmail API error:', error);
    res.status(error.message === 'Gmail not connected' ? 401 : 500).json({ error: error.message });
  }
});

app.get('/api/gmail/messages/:id', async (req, res) => {
  try {
    const gmail = await getGmailClient();
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: req.params.id
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.message === 'Gmail not connected' ? 401 : 500).json({ error: error.message });
  }
});

app.post('/api/gmail/send', async (req, res) => {
  try {
    const { to, subject, body, threadId } = req.body;
    const gmail = await getGmailClient();
    
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      body,
    ];
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
        threadId: threadId
      }
    });
    
    res.json(response.data);
  } catch (error: any) {
    res.status(error.message === 'Gmail not connected' ? 401 : 500).json({ error: error.message });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
