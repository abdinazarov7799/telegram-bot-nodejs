const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const { isEqual } = require("lodash");

const token = '6489880884:AAFG3RJMURH8EkMr4KAYGPtjaK6Csbgtwuw';
const bot = new TelegramBot(token, { polling: true });
let contact = null;
let location = null;

const commands = [
    {
        command: "/start",
        description: "Botni ishga tushirish"
    },
    {
        command: "/getme",
        description: "Men haqimda"
    },
    {
        command: "/menu",
        description: "Menu"
    }
];
bot.setMyCommands(commands);

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (isEqual(messageText, '/start')) {
        bot.sendMessage(chatId, 'Assalomu aleykum xush kelibsiz', {
            reply_markup: {
                keyboard: [
                    [{text: 'Kotakt yuborish', request_contact: true}],
                    [{text: 'Lokatsiya yuborish', request_location: true}],
                    [{text: 'Men haqimda'}],
                    [{text: 'Bot menyusi'}],
                ],
                resize_keyboard: true
            }
        });
    } else if (isEqual(messageText, '/getme') || isEqual(messageText, 'Men haqimda')) {
        bot.sendMessage(chatId,
            `
        Ismingiz: ${msg.from.first_name}
        Familiyangiz: ${msg.from.last_name}
        User nameingiz: ${msg.from.username}
        Telefon Raqamingiz: ${contact.phone_number}
    `);

    } else if (isEqual(messageText, '/menu') || isEqual(messageText, "Bot menyusi")) {
        bot.sendMessage(chatId, 'Bot menyusi', {
            reply_markup: {
                keyboard: [
                    ['Men haqimda'],
                ],
                resize_keyboard: true
            }
        });
    }
});

bot.on('photo', img => {
    const chatId = img.chat.id;
    try {
        bot.downloadFile(img.photo[img.photo.length - 1].file_id, './images');
        bot.sendPhoto(chatId, './images/file_0.jpg')
        console.log("Image successfully downloaded");
    } catch (error) {
        console.log(error);
    }
});

bot.on('contact', res => {
    try {
        contact = res.contact;
    }
    catch (error) {
        console.log(error)
    }
})

bot.on('location', res => {
    bot.sendLocation(res.chat.id, res.location.latitude ,res.location.longitude)
    bot.sendMessage(res.chat.id,`
    Uzunlik: ${res.location.longitude}
    Kenglik: ${res.location.latitude}
    `)
})
