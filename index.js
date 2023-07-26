const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require('express');
const {getPreInscriptionId, getStructureId, getRendezVousDates} = require("./utils");
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
// replace the value below with the Telegram token you receive from @BotFather
const token = "6570024376:AAEBM9gdTyX8ljKY0xpQY_pZeE6PbgwZQXE";

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
    const hachemiChatId = "248737692";
    const chatId = msg.chat.id;
    const userInput = msg.text;

    console.log(msg)
    try {

        // Fetch anem pre-inscription
        const preInscriptionId = await getPreInscriptionId("1234567", "123456")
        if (!preInscriptionId) {
            await bot.sendMessage(
                hachemiChatId,
                `Could not find the user => from: ${msg.from.first_name} ${msg.from.last_name} (${msg.from.username})`
            );
            await bot.sendMessage(chatId, "Could not find the user");
            return;
        }

        // Fetch anem structure id
        const structureId = await getStructureId(preInscriptionId);
        if (!structureId) {
            await bot.sendMessage(
                hachemiChatId,
                `Could not find the structure id => from: ${msg.from.first_name} ${msg.from.last_name} (${msg.from.username})`
            );
            await bot.sendMessage(chatId, "Could not find the structure id");
            return;
        }

        // Fetch anem available dates
        const availableDates = await getRendezVousDates(preInscriptionId, structureId);
        if (!availableDates) {
            await bot.sendMessage(
                hachemiChatId,
                `Could not find the available dates => from: ${msg.from.first_name} ${msg.from.last_name} (${msg.from.username})`
            );
            await bot.sendMessage(chatId, "Could not find available dates");
            return;
        }

        const message = `This is test [ADEL_GSM]. Still few things to work on YET`;

        await bot.sendMessage(hachemiChatId, message);
        await bot.sendMessage(chatId, message);
    } catch (error) {

    }
});