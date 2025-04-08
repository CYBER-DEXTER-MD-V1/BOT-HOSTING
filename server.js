const express = require('express');
const multer = require('multer');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Setup Express and Multer
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const upload = multer({ dest: 'uploads/' });

// Serve the frontend
app.use(express.static('public'));
app.use(express.json());

// Device pairing code store
let devicePairingCode = '';

// WhatsApp client setup
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

// Log in to WhatsApp
client.on('qr', (qr) => {
  // Generate and display the QR code for WhatsApp Web authentication
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp is ready!');
});

// Image upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // After image upload, change the profile picture
  changeWhatsAppDP(req.file.path);

  res.status(200).send({ filePath: `/uploads/${req.file.filename}` });
});

// Pairing code generation endpoint
app.get('/generate-pairing-code', (req, res) => {
  // Generate an alphanumeric pairing code
  devicePairingCode = generatePairingCode();
  res.status(200).send({ pairingCode: devicePairingCode });
});

// Verify pairing code
app.post('/verify-pairing-code', (req, res) => {
  const { code } = req.body;

  if (code === devicePairingCode) {
    res.status(200).send({ message: 'Device paired successfully!' });
  } else {
    res.status(400).send({ message: 'Invalid pairing code!' });
  }
});

// Function to generate an alphanumeric pairing code (e.g., L5RXH9JV)
function generatePairingCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Function to change WhatsApp DP
function changeWhatsAppDP(imagePath) {
  client.on('ready', async () => {
    try {
      // Change profile picture
      await client.setProfilePic(imagePath);
      console.log('Profile picture changed successfully!');
    } catch (error) {
      console.log('Error changing profile picture:', error);
    }
  });
}

// Start the WhatsApp client
client.initialize();

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
