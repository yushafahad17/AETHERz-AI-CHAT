const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();
const { replaceEmojis } = require('../services/aiService');

exports.generateTTS = async (req, res) => {
    let { text } = req.body;

    // Ganti emoji dengan deskripsinya
    text = replaceEmojis(text);

    try {
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
            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(Buffer.from(response.data, 'base64'));
        } else {
            throw new Error('Invalid response from Micmonster TTS service');
        }
    } catch (error) {
        console.error('TTS Error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan saat menghasilkan TTS',
            details: error.message
        });
    }
};
