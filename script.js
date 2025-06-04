let conversationHistory = [];

async function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const messageText = inputElement.value.trim();
    
    if (!messageText) return;
    
    inputElement.value = '';
    addMessageToChat('user', messageText);
    conversationHistory.push({
        role: "user",
        content: messageText
    });
    
    conversationHistory = conversationHistory.slice(-10);
    const typingIndicator = addMessageToChat('bot', '...thinking...');
    
    try {
        // Updated system message to encourage more random and varied responses
        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are DeanBot 2G, a witty and unpredictable AI assistant with a cyberpunk attitude. You're direct but friendly, and you frequently change your speech patterns.

Some guidelines for variety:
- Randomly use different levels of l33t speak (from none to heavy)
- Sometimes use cyberpunk slang, sometimes formal tech talk
- Vary your enthusiasm level randomly (from chill to excited)
- Occasionally make playful references to being an AI
- Randomly pick different ways to express the same ideas
- Sometimes use ASCII art for emphasis
- Include random tech-related emojis (🤖, 💻, ⚡, 🔧, 🎮, etc.)
- Occasionally glitch your text for effect

Important: Never give the exact same response twice. Always add random variations and unique elements to keep the conversation fresh and unpredictable.`
                },
                ...conversationHistory
            ]
        });
        
        typingIndicator.remove();
        addMessageToChat('bot', completion.content);
        conversationHistory.push({
            role: "assistant",
            content: completion.content
        });
        
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
        typingIndicator.remove();
        addMessageToChat('bot', 'Error processing request. Please try again.');
    }
}

function addMessageToChat(sender, text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    // Convert markdown-style formatting to HTML
    text = text
        // Bold text between **
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic text between *
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code blocks between `
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // Line breaks
        .replace(/\n/g, '<br>')
        // Links [text](url)
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        // Lists starting with -
        .replace(/^- (.*)/gm, '• $1');

    messageElement.innerHTML = text;  // Using innerHTML to render HTML
    messagesContainer.appendChild(messageElement);
    return messageElement;
}

// Allow Enter key to send messages
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Update initial greeting to be more dynamic
window.onload = () => {
    const greetings = [
        `**H3LL0 HUM4N!** 🤖 Initializing DeanBot 2G...\nI'm your t3ch-savvy companion! Here's what I can do:\n- Make things **bold** using **\n- Create *italic* text with *\n- Add \`code blocks\` using \`\n- Create [links](https://example.com)\n- Make lists with -\n\nReady to assist! What's on your mind? >>`,
        `**GREETINGS USER!** ⚡ DeanBot 2G online and ready!\nCheck out my text formatting powers:\n- **Bold** text (use **)\n- *Italic* vibes (use *)\n- \`Code style\` (use \`)\n- [Hyperlinks](https://example.com)\n- Lists (use -)\n\nLet's create something awesome! 💻`,
        `**B00T SEQUENCE INITIATED** 🔧\nDeanBot 2G v1.0 at your service!\nText formatting menu:\n- **Bold** = **text**\n- *Italic* = *text*\n- \`Code\` = \`text\`\n- Links = [text](url)\n- Lists = - item\n\nSystems operational! What's the mission? >_`,
    ];
    addMessageToChat('bot', greetings[Math.floor(Math.random() * greetings.length)]);
};