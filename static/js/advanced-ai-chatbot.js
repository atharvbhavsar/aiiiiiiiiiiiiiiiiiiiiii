// Enhanced AI Chatbot with Voice Features
class AdvancedAIChatbot {
    constructor() {
        this.isListening = false;
        this.isVoiceEnabled = false;
        this.apiKey = 'AIzaSyC-2jr4RlBvKWW8sdjdGjJBQ1ujHR-D2Xs';
        this.chatHistory = [];
        this.initializeVoiceFeatures();
        this.initializeChatbot();
    }

    initializeVoiceFeatures() {
        // Check for browser support
        if ('speechSynthesis' in window) {
            this.isVoiceEnabled = true;
            console.log('Voice synthesis available');
        }

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleVoiceInput(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateVoiceButton();
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceButton();
            };
        }
    }

    initializeChatbot() {
        this.addEventListeners();
        this.displayWelcomeMessage();
    }

    addEventListeners() {
        // Chat input and send button
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        const voiceButton = document.getElementById('voice-input-btn');
        
        if (chatInput && sendButton) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
            
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (voiceButton) {
            voiceButton.addEventListener('click', () => {
                this.toggleVoiceInput();
            });
        }

        // Chatbot toggle
        const chatbotBtn = document.getElementById('chatbot-btn');
        const closeChatbot = document.getElementById('close-chatbot');
        
        if (chatbotBtn) {
            chatbotBtn.addEventListener('click', () => {
                this.toggleChatbot();
            });
        }

        if (closeChatbot) {
            closeChatbot.addEventListener('click', () => {
                this.closeChatbot();
            });
        }
    }

    displayWelcomeMessage() {
        const welcomeMessage = `
            🎓 Welcome to AdmitAI! I'm your intelligent college admission assistant.
            
            I can help you with:
            • College recommendations based on your scores
            • MHT-CET, JEE Main, and BITSAT information
            • Cutoff trends and admission probability
            • Document requirements and deadlines
            • Placement statistics and career guidance
            
            💬 Type your question or click the microphone to speak!
        `;
        
        this.addMessageToChat('bot', welcomeMessage);
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessageToChat('user', message);
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addMessageToChat('bot', response);
            
            // Speak response if voice is enabled
            if (this.isVoiceEnabled) {
                this.speakText(response);
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessageToChat('bot', 'Sorry, I encountered an error. Please try again or contact support.');
            console.error('Error getting AI response:', error);
        }
    }

    async getAIResponse(message) {
        // Enhanced prompt for college-specific responses
        const systemPrompt = `You are AdmitAI, an expert college admission assistant for Indian engineering colleges. You specialize in:
        - MHT-CET, JEE Main, JEE Advanced, BITSAT, and state entrance exams
        - Maharashtra engineering colleges (COEP, VJTI, PICT, etc.)
        - Cutoff trends, admission processes, and document requirements
        - Career guidance and placement statistics
        
        Provide helpful, accurate, and specific information. Always be encouraging and supportive.
        
        User question: ${message}`;

        // Try multiple approaches for AI response
        try {
            // First try Gemini API
            const geminiResponse = await this.callGeminiAPI(systemPrompt);
            if (geminiResponse) {
                return geminiResponse;
            }
        } catch (error) {
            console.warn('Gemini API failed, using fallback');
        }

        // Fallback to rule-based responses
        return this.getRuleBasedResponse(message);
    }

    async callGeminiAPI(prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
        
        const data = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    }

    getRuleBasedResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // College-specific responses
        if (lowerMessage.includes('coep') || lowerMessage.includes('college of engineering pune')) {
            return `🏛️ COEP (College of Engineering Pune) is one of the top engineering colleges in Maharashtra!
            
            Key Information:
            • Established: 1854
            • Courses: Computer, IT, Mechanical, Electrical, Civil, E&TC, Chemical
            • MHT-CET Cutoff (General): 99.5+ percentile for Computer Engineering
            • Fees: ₹1,25,000 per year (approx)
            • Placements: Average package ₹8-12 LPA, Highest ₹50+ LPA
            
            Would you like specific cutoff information for any branch?`;
        }

        if (lowerMessage.includes('vjti') || lowerMessage.includes('veermata jijabai')) {
            return `🏛️ VJTI Mumbai is among the premier engineering institutes in Maharashtra!
            
            Key Information:
            • Established: 1887
            • Location: Matunga, Mumbai
            • Courses: Computer, IT, Mechanical, Electrical, Electronics, Textile
            • MHT-CET Cutoff (General): 99.4+ percentile for Computer Engineering
            • Fees: ₹1,10,000 per year (approx)
            • Placements: Average package ₹10-15 LPA, Top companies visit
            
            Need more details about admissions or specific branches?`;
        }

        if (lowerMessage.includes('cutoff') || lowerMessage.includes('percentile')) {
            return `📊 MHT-CET Cutoff Trends (2024):
            
            Top Colleges - Computer Engineering:
            • COEP: 99.5+ percentile
            • VJTI: 99.4+ percentile  
            • PICT: 98.8+ percentile
            • APSIT: 96.5+ percentile
            
            Note: Cutoffs vary by category (General/OBC/SC/ST/EWS)
            
            What's your percentile? I can suggest suitable colleges! 🎯`;
        }

        if (lowerMessage.includes('document') || lowerMessage.includes('certificates')) {
            return `📄 Required Documents for MHT-CET Admission:
            
            Essential Documents:
            ✅ MHT-CET Scorecard
            ✅ 12th Marksheet & Certificate
            ✅ 10th Marksheet & Certificate
            ✅ Domicile Certificate (for Maharashtra quota)
            ✅ Caste Certificate (if applicable)
            ✅ Income Certificate (for fee concessions)
            ✅ Aadhaar Card
            ✅ Passport Photos
            
            Keep all documents ready in original + 3 photocopies! 📋`;
        }

        if (lowerMessage.includes('placement') || lowerMessage.includes('job') || lowerMessage.includes('salary')) {
            return `💼 Placement Statistics (Average across top colleges):
            
            Computer/IT Engineering:
            • Average Package: ₹8-15 LPA
            • Highest Package: ₹50+ LPA
            • Top Recruiters: TCS, Infosys, Microsoft, Google, Amazon
            
            Core Branches (Mechanical/Electrical/Civil):
            • Average Package: ₹6-10 LPA
            • Top Companies: L&T, Bajaj, Mahindra, Tata Motors
            
            Which branch interests you? I can provide specific details! 🚀`;
        }

        if (lowerMessage.includes('fees') || lowerMessage.includes('cost')) {
            return `💰 Fee Structure (Per Year):
            
            Government Colleges:
            • General Category: ₹1,00,000 - ₹1,50,000
            • Reserved Categories: ₹25,000 - ₹75,000
            
            Private/Autonomous Colleges:
            • General Fee: ₹2,00,000 - ₹4,00,000
            • Scholarship opportunities available
            
            Additional Costs:
            • Hostel: ₹50,000 - ₹1,00,000
            • Books & Materials: ₹20,000
            
            Need help with scholarship information? 🎓`;
        }

        // Default helpful response
        return `Hello! I'm here to help with your college admission queries. You can ask me about:

        🏛️ Colleges: COEP, VJTI, PICT, and 150+ others
        📊 Cutoffs: MHT-CET, JEE Main percentile requirements  
        📄 Documents: Required certificates and procedures
        💼 Placements: Job opportunities and salary packages
        💰 Fees: Cost breakdown and scholarships
        📅 Deadlines: Important dates and timelines

        What would you like to know? Feel free to be specific! 😊`;
    }

    addMessageToChat(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3 mb-4';

        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-robot text-white text-sm"></i>
                </div>
                <div class="bg-gray-100 p-3 rounded-lg max-w-xs">
                    <p class="text-sm whitespace-pre-line">${message}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-user text-white text-sm"></i>
                </div>
                <div class="bg-blue-100 p-3 rounded-lg max-w-xs">
                    <p class="text-sm">${message}</p>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'flex items-start space-x-3 mb-4';
        indicator.innerHTML = `
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <i class="fas fa-robot text-white text-sm"></i>
            </div>
            <div class="bg-gray-100 p-3 rounded-lg">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.appendChild(indicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            alert('Voice input not supported in this browser');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
            this.isListening = true;
            this.updateVoiceButton();
        }
    }

    updateVoiceButton() {
        const voiceButton = document.getElementById('voice-input-btn');
        if (voiceButton) {
            if (this.isListening) {
                voiceButton.innerHTML = '<i class="fas fa-stop text-red-500"></i>';
                voiceButton.title = 'Stop listening';
            } else {
                voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceButton.title = 'Start voice input';
            }
        }
    }

    handleVoiceInput(transcript) {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.value = transcript;
            this.sendMessage();
        }
    }

    speakText(text) {
        if ('speechSynthesis' in window) {
            // Clean text for speech
            const cleanText = text.replace(/[🎓📊🏛️📄💼💰📅✅🚀😊]/g, '').replace(/\n/g, ' ');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    toggleChatbot() {
        const chatbotWindow = document.getElementById('chatbot-window');
        if (chatbotWindow) {
            chatbotWindow.classList.toggle('hidden');
        }
    }

    closeChatbot() {
        const chatbotWindow = document.getElementById('chatbot-window');
        if (chatbotWindow) {
            chatbotWindow.classList.add('hidden');
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.aiChatbot = new AdvancedAIChatbot();
});

// Enhanced notification system
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.initializeNotifications();
    }

    initializeNotifications() {
        // Check for important deadlines and updates
        this.checkImportantDates();
        this.setupPeriodicChecks();
    }

    checkImportantDates() {
        const currentDate = new Date();
        const notifications = [
            {
                title: "MHT-CET 2025 Registration",
                message: "Registration opens March 2025. Start preparing your documents!",
                type: "info",
                priority: "medium"
            },
            {
                title: "Document Verification",
                message: "Ensure all certificates are ready for admission process.",
                type: "warning",
                priority: "high"
            },
            {
                title: "AI Assistant Available",
                message: "Your 24/7 AI assistant is ready to help with admissions!",
                type: "success",
                priority: "low"
            }
        ];

        notifications.forEach(notification => {
            this.showNotification(notification);
        });
    }

    showNotification(notification) {
        const notificationContainer = this.getOrCreateNotificationContainer();
        
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification ${notification.type} animate-fade-in`;
        notificationElement.innerHTML = `
            <div class="notification-header">
                <h4>${notification.title}</h4>
                <button class="close-notification" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p>${notification.message}</p>
        `;

        notificationContainer.appendChild(notificationElement);

        // Auto-remove after 5 seconds for low priority notifications
        if (notification.priority === 'low') {
            setTimeout(() => {
                notificationElement.remove();
            }, 5000);
        }
    }

    getOrCreateNotificationContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }
        return container;
    }

    setupPeriodicChecks() {
        // Check for updates every hour
        setInterval(() => {
            this.checkForUpdates();
        }, 3600000);
    }

    checkForUpdates() {
        // This would typically make an API call to check for new information
        console.log('Checking for updates...');
    }
}

// Initialize notification system
document.addEventListener('DOMContentLoaded', function() {
    window.notificationSystem = new NotificationSystem();
});