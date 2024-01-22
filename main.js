const TelegramBot = require('node-telegram-bot-api');

const token = '6489880884:AAFG3RJMURH8EkMr4KAYGPtjaK6Csbgtwuw';
const bot = new TelegramBot(token, { polling: true });


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    console.log(msg)
    bot.sendMessage(chatId, `Men node js orqali ishlayabman. Bu sizning habaringiz: ${messageText}`);
});

