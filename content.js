
if (window.location.hostname.includes("gather.town")) {
    function sendNotificationToTelegram(message) {
        chrome.runtime.sendMessage({ type: "notification", message: `Gather: ${message}` });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].classList?.contains("WaveNotification")) {
                const username = mutation.addedNodes[0].querySelector(".name").innerText;
                sendNotificationToTelegram(`${username} acenou para você! 👋`);
            }

            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].classList?.contains("CallNotification")) {
                const caller = mutation.addedNodes[0].querySelector(".callerName").innerText;
                sendNotificationToTelegram(`${caller} está chamando você por áudio! 📞`);
            }

            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].classList?.contains("ChatMessage")) {
                const username = mutation.addedNodes[0].querySelector(".ChatMessage__name").innerText;
                const message = mutation.addedNodes[0].querySelector(".ChatMessage__content").innerText;
                sendNotificationToTelegram(`${username} enviou uma mensagem no chat: "${message}" 💬`);
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Monitorando notificações do Gather...");
}
