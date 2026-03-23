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

// Check for required environment variables
const checkEnvVars = () => {
  const missing = [];
  if (!process.env.GOOGLE_CLIENT_ID) missing.push('GOOGLE_CLIENT_ID');
  if (!process.env.GOOGLE_CLIENT_SECRET) missing.push('GOOGLE_CLIENT_SECRET');
  if (!process.env.APP_URL) missing.push('APP_URL');
  return missing;
};

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
app.get('/api/auth/google/status', async (req, res) => {
  try {
    const missing = checkEnvVars();
    if (missing.length > 0) {
      return res.json({ 
        connected: false, 
        error: `Variables d'environnement manquantes: ${missing.join(', ')}` 
      });
    }

    const doc = await db.collection('config').doc('gmail_tokens').get();
    res.json({ connected: doc.exists });
  } catch (error: any) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

app.get('/api/auth/google/url', (req, res) => {
  const missing = checkEnvVars();
  if (missing.length > 0) {
    return res.status(400).json({ error: `Veuillez configurer les variables: ${missing.join(', ')}` });
  }

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
let isTokenListenerSet = false;

async function getGmailClient() {
  const doc = await db.collection('config').doc('gmail_tokens').get();
  if (!doc.exists) {
    throw new Error('Gmail not connected');
  }
  const tokens = doc.data();
  oauth2Client.setCredentials(tokens!);
  
  // Handle token refresh - set up listener only once
  if (!isTokenListenerSet) {
    oauth2Client.on('tokens', async (newTokens) => {
      try {
        const tokenDoc = db.collection('config').doc('gmail_tokens');
        const currentDoc = await tokenDoc.get();
        const currentTokens = currentDoc.data() || {};
        
        // Merge new tokens with existing ones to preserve refresh_token
        const updatedTokens = {
          ...currentTokens,
          ...newTokens
        };
        
        await tokenDoc.set(updatedTokens);
        console.log('Gmail tokens refreshed and saved to Firestore');
      } catch (err) {
        console.error('Error saving refreshed tokens:', err);
      }
    });
    isTokenListenerSet = true;
  }

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
