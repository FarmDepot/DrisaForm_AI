(function() {
    // --- Configuration ---
    const BACKEND_URL = "https://drisaform-ai.onrender.com/chat";

    // --- 1. CSS Styles (Updated) ---
    const styles = `
        :root {
            --primary-color: #b21823;
            --secondary-color: #8c128a;
            --font-color: #ffffff;
            --light-gray: #f0f0f0;
        }

        #drisaform-chat-bubble {
            position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px;
            background-color: var(--primary-color); border-radius: 50%; color: var(--font-color);
            display: flex; justify-content: center; align-items: center; font-size: 28px;
            cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: transform 0.2s ease-in-out, opacity 0.3s;
            z-index: 9998; opacity: 0; transform: scale(0);
        }
        #drisaform-chat-bubble.visible { opacity: 1; transform: scale(1); }
        #drisaform-chat-bubble:hover { transform: scale(1.1); }
        #drisaform-chat-window {
            position: fixed; bottom: 90px; right: 20px; width: 90%; max-width: 370px;
            height: 70vh; max-height: 550px; background-color: #f9f9f9;
            border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            display: flex; flex-direction: column; overflow: hidden;
            transform: scale(0); transform-origin: bottom right;
            transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
            z-index: 9999;
        }
        #drisaform-chat-window.open { transform: scale(1); }
        .drisaform-header {
            background-color: var(--primary-color); color: var(--font-color); padding: 10px 15px;
            display: flex; justify-content: space-between; align-items: center;
            font-weight: bold; font-family: Arial, sans-serif;
        }
        /* NEW: Language Switcher Style */
        #drisaform-language-switcher {
            background-color: var(--primary-color); color: var(--font-color);
            border: 1px solid var(--font-color); border-radius: 5px;
            padding: 3px 5px; font-size: 12px; outline: none;
        }
        .drisaform-messages { flex-grow: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
        .drisaform-message { padding: 10px 15px; border-radius: 20px; margin-bottom: 10px; max-width: 80%; line-height: 1.4; font-size: 15px; }
        .drisaform-message.user { background-color: #e0e0e0; color: #333; align-self: flex-end; border-bottom-right-radius: 5px; }
        .drisaform-message.bot { background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: var(--font-color); align-self: flex-start; border-bottom-left-radius: 5px; }
        .drisaform-input-area { display: flex; flex-direction: column; border-top: 1px solid #ddd; background-color: #fff; }
        .drisaform-main-input { display: flex; padding: 10px; }
        #drisaform-input { flex-grow: 1; border: 1px solid #ccc; border-radius: 20px; padding: 10px 15px; font-size: 16px; outline: none; }
        #drisaform-send-btn { width: 40px; height: 40px; margin-left: 10px; border: none; background-color: var(--primary-color); color: var(--font-color); border-radius: 50%; font-size: 20px; cursor: pointer; transition: background-color 0.2s; }
        #drisaform-send-btn:hover { background-color: var(--secondary-color); }
        
        /* NEW: Voice Control Styles */
        .drisaform-voice-controls { display: flex; align-items: center; padding: 5px 12px 10px; background-color: var(--light-gray); }
        #drisaform-voice-btn {
            background: none; border: none; cursor: pointer; padding: 5px; display: flex; align-items: center;
        }
        #drisaform-voice-btn svg { width: 24px; height: 24px; fill: #555; }
        #drisaform-voice-btn:hover svg { fill: var(--primary-color); }
        #drisaform-voice-btn.listening svg { fill: var(--secondary-color); animation: pulse 1.5s infinite; }
        #drisaform-voice-status { margin: 0 0 0 10px; font-size: 12px; color: #666; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
    `;

    // --- 2. HTML Structure (Updated) ---
    const widgetHTML = `
        <div id="drisaform-chat-bubble">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM7.194 6.766a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 5.734 6C4.776 6 4 6.746 4 7.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26l.008-.004c.257-.115.462-.27.64-.458a1.688 1.688 0 0 0 .227-.273L8 9.583V7.008L7.194 6.766zm3.624 0a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 9.358 6C8.399 6 7.624 6.746 7.624 7.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26l.008-.004c.257-.115.462-.27.64-.458a1.688 1.688 0 0 0 .227-.273L11.624 9.583V7.008L10.818 6.766z"/>
            </svg>
        </div>
        <div id="drisaform-chat-window">
            <div class="drisaform-header">
                <span data-i18n-key="headerTitle">FarmDepot Support</span>
                <select id="drisaform-language-switcher">
                    <option value="en">English</option>
                    <option value="ha">Hausa</option>
                    <option value="ig">Igbo</option>
                    <option value="yo">Yoruba</option>
                </select>
            </div>
            <div class="drisaform-messages"></div>
            <div class="drisaform-input-area">
                <div class="drisaform-main-input">
                    <input type="text" id="drisaform-input" data-i18n-key-placeholder="inputPlaceholder" placeholder="Ask me anything...">
                    <button id="drisaform-send-btn">&#10148;</button>
                </div>
                <div class="drisaform-voice-controls">
                    <button id="drisaform-voice-btn" title="Use Voice">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/></svg>
                    </button>
                    <span id="drisaform-voice-status" data-i18n-key="voiceStatusIdle">Status: Idle</span>
                </div>
            </div>
        </div>
    `;

    // --- 3. Plugin Logic (Updated) ---
    function initializeDrisaForm() {
        // Inject CSS and HTML
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        // Get references to DOM elements
        const chatBubble = document.getElementById('drisaform-chat-bubble');
        const chatWindow = document.getElementById('drisaform-chat-window');
        const messagesContainer = document.querySelector('.drisaform-messages');
        const inputField = document.getElementById('drisaform-input');
        const sendButton = document.getElementById('drisaform-send-btn');
        const headerTitle = document.querySelector('[data-i18n-key="headerTitle"]');

        // --- NEW: i18n and Voice Elements ---
        const languageSwitcher = document.getElementById('drisaform-language-switcher');
        const voiceBtn = document.getElementById('drisaform-voice-btn');
        const voiceStatus = document.getElementById('drisaform-voice-status');

        let currentLang = 'en';
        let translations = {};

        // Show chat bubble
        setTimeout(() => chatBubble.classList.add('visible'), 500);
        chatBubble.addEventListener('click', () => chatWindow.classList.toggle('open'));

        // --- NEW: Internationalization (i18n) Logic ---
        async function loadTranslations(lang, isInitialLoad = false) {
            try {
                // Use the URL from the object passed by wp_localize_script
                const response = await fetch(drisaform_params.languageFiles[lang]);
                translations = await response.json();
                updateContent();
                updateVoiceServices();
                if (isInitialLoad) {
                    addMessage(translations.initialBotMessage, 'bot');
                }
            } catch (error) {
                console.error('DrisaForm Translation Error:', error);
            }
        }

        function updateContent() {
            headerTitle.textContent = translations.headerTitle;
            inputField.placeholder = translations.inputPlaceholder;
            voiceStatus.textContent = translations.voiceStatusIdle;
            voiceBtn.title = translations.voiceButtonLabel;
        }

        languageSwitcher.addEventListener('change', (event) => {
            currentLang = event.target.value;
            loadTranslations(currentLang);
        });

        // --- NEW: Voice Interaction Logic ---
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = SpeechRecognition ? new SpeechRecognition() : null;
        const speechSynthesis = window.speechSynthesis;

        if (!recognition) {
            document.querySelector('.drisaform-voice-controls').style.display = 'none';
        } else {
            function updateVoiceServices() {
                recognition.lang = currentLang;
            }

            voiceBtn.addEventListener('click', () => {
                if (voiceBtn.classList.contains('listening')) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            });

            recognition.onstart = () => {
                voiceBtn.classList.add('listening');
                voiceStatus.textContent = translations.voiceStatusListening;
            };

            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript;
                inputField.value = command; // Put recognized speech into input
                handleVoiceCommand(command.toLowerCase().trim());
            };

            recognition.onerror = (event) => {
                voiceStatus.textContent = `Error: ${event.error}`;
            };

            recognition.onend = () => {
                voiceBtn.classList.remove('listening');
                voiceStatus.textContent = translations.voiceStatusIdle;
            };

            function handleVoiceCommand(command) {
                // If command is long, assume it's a message and send it
                if (command.split(' ').length > 3) {
                     sendMessage();
                     return;
                }
                
                // Handle specific short commands
                if (command.includes("change language to hausa")) {
                    languageSwitcher.value = 'ha';
                    languageSwitcher.dispatchEvent(new Event('change'));
                } else if (command.includes("change language to igbo")) {
                    languageSwitcher.value = 'ig';
                    languageSwitcher.dispatchEvent(new Event('change'));
                } else if (command.includes("change language to yoruba")) {
                    languageSwitcher.value = 'yo';
                    languageSwitcher.dispatchEvent(new Event('change'));
                } else if (command.includes("read last message")) {
                    const lastBotMessage = messagesContainer.querySelector('.drisaform-message.bot:last-child');
                    if (lastBotMessage) {
                        speak(lastBotMessage.textContent);
                    }
                } else {
                    // Default action: treat it as a message to be sent
                    sendMessage();
                }
            }

            function speak(text) {
                if (speechSynthesis.speaking) speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = currentLang;
                utterance.rate = 0.9;
                speechSynthesis.speak(utterance);
            }
        }

        // --- Original Functions (Slightly Modified) ---
        function addMessage(text, sender) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('drisaform-message', sender);
            messageElement.textContent = text;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function handleBotAction(action, payload) {
            if (!action || !payload) return;
            if (action === 'navigate') window.location.href = payload.url;
            else if (action === 'search') { /* ... your existing logic ... */ }
            else if (action === 'fill_form') { /* ... your existing logic ... */ }
        }

        async function sendMessage() {
            const messageText = inputField.value.trim();
            if (messageText === '') return;

            addMessage(messageText, 'user');
            inputField.value = '';

            try {
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: messageText,
                        language: currentLang // DYNAMICALLY SET LANGUAGE
                    }),
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                
                const data = await response.json();
                addMessage(data.message, 'bot');
                // NEW: Read the bot's response aloud
                speak(data.message);
                handleBotAction(data.action, data.payload);

            } catch (error) {
                console.error('DrisaForm Error:', error);
                addMessage(translations.connectionError, 'bot');
            }
        }

        sendButton.addEventListener('click', sendMessage);
        inputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });

        // --- Run Initializer ---
        loadTranslations(currentLang, true); // Load default language on start
    }

    // --- Start the plugin ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDrisaForm);
    } else {
        initializeDrisaForm();
    }
})();
