const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6489880884:AAFG3RJMURH8EkMr4KAYGPtjaK6Csbgtwuw';
const webAppUrl = 'https://restoran-telegram-web-app.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, "Pastdagi tugma orqali malumotlaringizni kiriting", {
            reply_markup: {
                resize_keyboard: true,
                keyboard: [
                    [{text: "Malumotlarni to'ldirish", web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        })

        await bot.sendMessage(chatId, "Quyidagi tugma yordamida onlayn do'konimizga tashrif buyuring", {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Zakaz berish', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }

    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            await bot.sendMessage(chatId, 'Malumotlarni kiritganingiz uchun tashakkur!')
            await bot.sendMessage(chatId, 'Sizning mamlakatingiz: ' + data?.country);
            await bot.sendMessage(chatId, 'Sizning ko\'changiz: ' + data?.street);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Siz ushbu chatda barcha ma\'lumotlarni olasiz');
            }, 3000)
        } catch (e) {
            console.log(e);
        }
    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Muvaffaqiyatli xarid',
            input_message_content: {
                message_text: ` Xaridingiz bilan tabriklaymiz, siz qimmatbaho buyum sotib oldingiz ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))
