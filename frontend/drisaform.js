(function() {
    // Configuration
    const BACKEND_URL = "http://127.0.0.1:8000/chat";

    // Create and inject the CSS
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'drisaform.css'; // Path to your CSS file
    document.head.appendChild(style);

    // Create the HTML structure for the chat widget
    const chatWidgetHTML = `
        <div id="drisaform-chat-bubble">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-chat-quote-fill" viewBox="0 0 16 16">
                <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM7.194 6.766a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 5.734 6C4.776 6 4 6.746 4 7.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26l.008-.004c.257-.115.462-.27.64-.458a1.688 1.688 0 0 0 .227-.273L8 9.583V7.008L7.194 6.766zm3.624 0a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 9.358 6C8.399 6 7.624 6.746 7.624 7.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26l.008-.004c.257-.115.462-.27.64-.458a1.688 1.688 0 0 0 .227-.273L11.624 9.583V7.008L10.818 6.766z"/>
            </svg>
        </div>
        <div id="drisaform-chat-window">
            <div class="drisaform-header">DrisaForm Farm Support</div>
            <div class="drisaform-messages"></div>
            <div class="drisaform-input-area">
                <input type="text" id="drisaform-input" placeholder="Ask me anything...">
                <button id="drisaform-send-btn">&#10148;</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatWidgetHTML);

    // Get references to DOM elements
    const chatBubble = document.getElementById('drisaform-chat-bubble');
    const chatWindow = document.getElementById('drisaform-chat-window');
    const messagesContainer = document.querySelector('.drisaform-messages');
    const inputField = document.getElementById('drisaform-input');
    const sendButton = document.getElementById('drisaform-send-btn');

    // Toggle chat window visibility
    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });

    // Add a message to the chat window
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('drisaform-message', sender);
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Handle frontend actions from the bot
    function handleBotAction(action, payload) {
        if (action === 'navigate') {
            window.location.href = payload.url;
        } else if (action === 'search') {
            const searchInput = document.querySelector('input[name="q"]'); // Assuming a standard search input
            if(searchInput) {
                searchInput.value = payload.query;
                searchInput.form.submit();
            } else {
                 window.location.href = `/search?q=${encodeURIComponent(payload.query)}`;
            }
        } else if (action === 'fill_form') {
            const field = document.querySelector(payload.selector);
            if(field) {
                field.value = payload.value;
            }
        }
    }

    // Send message to backend
    async function sendMessage() {
        const messageText = inputField.value.trim();
        if (messageText === '') return;

        addMessage(messageText, 'user');
        inputField.value = '';

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    language: 'en' // Default language, can be made dynamic
                }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            addMessage(data.message, 'bot');

            if(data.action) {
                handleBotAction(data.action, data.payload);
            }

        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, something went wrong. Please try again.', 'bot');
        }
    }

    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Add initial welcome message
    setTimeout(() => {
        addMessage('Hello! I am DrisaForm, your farm support agent. How can I help you today?', 'bot');
    }, 1000);

})();
