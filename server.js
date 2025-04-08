const express = require('express');
const multer = require('multer');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');

// Setup Express and Multer
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const upload = multer({ dest: 'uploads/' });

// Serve the frontend
app.use(express.static('public'));

// Device pairing code store
let devicePairingCode = '';

// Image upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // For simplicity, just return the file path
  res.status(200).send({ filePath: `/uploads/${req.file.filename}` });

  // Optionally, you can integrate WhatsApp DP change here
  // Implement WhatsApp API to update DP
  // axios.post('https://api.whatsapp.com/updateDp', { imagePath: req.file.path });
});

// Pairing code generation endpoint
app.get('/generate-pairing-code', (req, res) => {
  // Simple example: generate a random pairing code
  devicePairingCode = Math.floor(1000 + Math.random() * 9000).toString();
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

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
