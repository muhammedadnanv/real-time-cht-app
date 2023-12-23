document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');

    const appendMessage = (username, message) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const username = prompt('Enter your username:');

    socket.emit('new-user', username);

    socket.on('chat-message', (data) => {
        appendMessage(data.username, data.message);
    });

    document.querySelector('button').addEventListener('click', () => {
        const message = messageInput.value;
        if (message.trim() !== '') {
            socket.emit('send-chat-message', message);
            appendMessage('You', message);
            messageInput.value = '';
        }
    });
});
