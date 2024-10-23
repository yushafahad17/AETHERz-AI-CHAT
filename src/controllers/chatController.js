const aiService = require('../services/aiService');

// Simpan sesi chat untuk setiap pengguna
const userSessions = new Map();

exports.userSessions = userSessions; // Ekspor userSessions agar bisa diakses dari server.js

exports.renderChatPage = (req, res) => {
  res.render('index');
};

exports.handleChatMessage = async (req, res) => {
  console.log('handleChatMessage called');
  const { message, history } = req.body;
  const sessionId = req.headers['x-session-id'];

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID tidak ditemukan' });
  }

  try {
    let sessionData = userSessions.get(sessionId) || { history: [], lastAccess: Date.now() };
    sessionData.lastAccess = Date.now();

    let sessionHistory = sessionData.history.concat(history);

    let reply;
    if (message.startsWith('Explain this file:')) {
      reply = await aiService.getAIResponse(message, sessionHistory);
    } else {
      reply = await aiService.getAIResponse(message, sessionHistory);
    }
    
    sessionData.history = sessionHistory.concat({ role: 'user', content: message }, { role: 'assistant', content: reply });
    userSessions.set(sessionId, sessionData);

    res.json({ reply: reply });
  } catch (error) {
    console.error('Kesalahan pada pengontrol chat:', error);
    res.status(500).json({ error: 'Maaf, terjadi kesalahan. Coba lagi nanti.' });
  }
};

const { getAIResponse } = require('../services/aiService');

exports.handleMessage = async (req, res) => {
    const { message, sessionId } = req.body;
    
    // Perbaikan deteksi bahasa
    const language = /[a-zA-Z]{4,}/.test(message) ? 'en' : 'id';

    try {
        const aiResponse = await getAIResponse(message, [], language);
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error in handleMessage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
