const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const chatController = require('./src/controllers/chatController');
const chatRoutes = require('./src/routes/chatRoutes');
const ttsController = require('./src/controllers/ttsController');
require('dotenv').config();
console.log('AI_API_URL:', process.env.AI_API_URL);
const cors = require('cors');
const axios = require('axios');
const config = require('./src/config/config');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk membersihkan sesi yang tidak aktif
const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000; // 2 hari dalam milidetik
setInterval(() => {
  const now = Date.now();
  chatController.userSessions.forEach((session, id) => {
    if (now - session.lastAccess > TWO_DAYS_IN_MS) {
      chatController.userSessions.delete(id);
      console.log(`Sesi ${id} telah dihapus karena tidak aktif selama 2 hari.`);
    }
  });
}, 6 * 60 * 60 * 1000); // Cek setiap 6 jam

// Rute untuk halaman login
app.get('/', chatController.renderChatPage);

app.use('/api', chatRoutes);

app.post('/api/tts', ttsController.generateTTS);

app.post('/tts-proxy', async (req, res) => {
  try {
    const { text } = req.body;
    const formData = new FormData();
    formData.append("locale", "id-ID");
    formData.append("content", `<voice name="id-ID-ArdiNeural">${text}</voice>`);
    formData.append("ip", req.ip);

    const response = await axios.post('https://app.micmonster.com/restapi/create', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (response.data && response.data.length > 0) {
      res.send(response.data);
    } else {
      throw new Error('Invalid response from TTS service');
    }
  } catch (error) {
    console.error('Error in TTS proxy:', error);
    res.status(500).json({ error: 'Error processing TTS request' });
  }
});

// Tentukan lokasi folder uploads
const uploadsDir = path.join(__dirname, 'uploads');

// Pastikan folder uploads ada
const fs = require('fs');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
