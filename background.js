
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "notification") {
        sendToTelegram(request.message);
    }
});

async function sendToTelegram(message) {
    const TELEGRAM_TOKEN = "SEU_TELEGRAM_BOT_TOKEN";
    const TELEGRAM_CHAT_ID = "SEU_CHAT_ID";

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
            }),
        });
    } catch (error) {
        console.error("Erro ao enviar mensagem ao Telegram:", error);
    }
}
