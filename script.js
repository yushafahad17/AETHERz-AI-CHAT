const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Inisialisasi riwayat chat dari sessionStorage atau buat array kosong jika belum ada
let chatHistory = JSON.parse(sessionStorage.getItem('chatHistory')) || [];

// Fungsi untuk memperbarui tampilan chat
function updateChatDisplay() {
    chatMessages.innerHTML = '';
    chatHistory.forEach(msg => {
        addMessage(msg.sender, msg.message);
    });
}

// Panggil fungsi ini saat halaman dimuat
updateChatDisplay();

sendButton.addEventListener('click', () => {
    console.log('Send button clicked');
    sendMessage();
});
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    console.log('sendMessage function called');
    const message = userInput.value.trim();
    if (message) {
        addMessageToHistory('user', message);
        userInput.value = '';
        fetchAIResponse(message);
    }
}

function addMessageToHistory(sender, message) {
    chatHistory.push({ sender, message });
    sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    addMessage(sender, message);
}

function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function fetchAIResponse(message) {
    try {
        const response = await fetch('https://rest-api.aetherss.xyz/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        addMessageToHistory('ai', data.response);
    } catch (error) {
        console.error('Error:', error);
        addMessageToHistory('ai', 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
    }
}

// Tambahkan tombol untuk mereset chat
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Chat';
resetButton.id = 'resetButton';
document.querySelector('.chat-header').appendChild(resetButton);

resetButton.addEventListener('click', function() {
    chatHistory = [];
    sessionStorage.removeItem('chatHistory');
    updateChatDisplay();
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const themeToggle = document.getElementById('theme-toggle');

    console.log('Elements:', { chatMessages, userInput, sendButton, themeToggle });

    // ... (kode lainnya tetap sama)

    function sendMessage() {
        console.log('sendMessage function called');
        const message = userInput.value.trim();
        console.log('Message:', message);
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            // ... (kode pengiriman pesan tetap sama)
        }
    }

    // Pastikan event listener terpasang dengan benar
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
        console.log('Click event listener added to send button');
    } else {
        console.error('Send button not found');
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        console.log('Keypress event listener added to user input');
    } else {
        console.error('User input not found');
    }

    // ... (kode lainnya tetap sama)
});

console.log('Script loaded');

window.onerror = function(message, source, lineno, colno, error) {
    console.error('Error caught:', message, 'Source:', source, 'Line:', lineno, 'Column:', colno, 'Error object:', error);
};

function saveHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}
