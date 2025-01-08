// Função para enviar notificações para o Telegram via background.js
function sendNotificationToTelegram(message) {
    chrome.runtime.sendMessage({ type: "notification", message: message });
}

// Set para armazenar IDs de mensagens já notificadas
const notifiedMessages = new Set();

// 🧵 Monitoramento no Slack Web
if (window.location.hostname.includes("slack.com")) {
    console.log("Monitorando notificações do Slack...");

    // Função para capturar mensagens
    function monitorSlackMessages() {
        const messageElements = document.querySelectorAll('[role="listitem"]');

        messageElements.forEach((messageElement) => {
            const messageId = messageElement.getAttribute('data-qa'); // Usando data-qa como ID único
            const messageText = messageElement.innerText;

            // Verifica se a mensagem já foi notificada
            if (messageId && !notifiedMessages.has(messageId)) {
                notifiedMessages.add(messageId); // Adiciona o ID ao Set
                sendNotificationToTelegram(`Slack: ${messageText}`);
            }
        });
    }

    // Observa mudanças na interface do Slack
    const slackObserver = new MutationObserver(() => {
        monitorSlackMessages();
    });

    slackObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });

    console.log("Monitoramento do Slack iniciado.");
}

// 💬 Monitoramento no Microsoft Teams
if (window.location.hostname.includes("teams.microsoft.com")) {
    console.log("Monitorando notificações do Microsoft Teams...");

    const teamsObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                const messageElement = mutation.target.querySelector(".message-body");
                if (messageElement) {
                    const message = messageElement.innerText;
                    sendNotificationToTelegram(`Teams: ${message}`);
                }
            }
        });
    });

    teamsObserver.observe(document.body, { childList: true, subtree: true });
}

// 📢 Monitoramento no Gather
if (window.location.hostname.includes("gather.town")) {
    console.log("Monitorando notificações do Gather...");

    const gatherObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Captura acenos (Wave)
            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].classList?.contains("WaveNotification")) {
                const username = mutation.addedNodes[0].querySelector(".name").innerText;
                sendNotificationToTelegram(`${username} acenou para você! 👋`);
            }

            // Captura chamadas de áudio
            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].classList?.contains("CallNotification")) {
                const caller = mutation.addedNodes[0].querySelector(".callerName").innerText;
                sendNotificationToTelegram(`${caller} está chamando você por áudio! 📞`);
            }

            // Captura mensagens no chat
            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].classList?.contains("ChatMessage")) {
                const username = mutation.addedNodes[0].querySelector(".ChatMessage__name").innerText;
                const message = mutation.addedNodes[0].querySelector(".ChatMessage__content").innerText;
                sendNotificationToTelegram(`${username} enviou uma mensagem no chat: "${message}" 💬`);
            }
        });
    });

    gatherObserver.observe(document.body, { childList: true, subtree: true });
}
