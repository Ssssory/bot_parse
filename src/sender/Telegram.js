require('dotenv').config();

const schedule = require('node-schedule');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);

bot.command('weather', (ctx) => {
    ctx.reply('ищу погоду в Бабяково 🌧');
});

bot.start((ctx) => {
    console.log('start');
    ctx.reply('О! Я ушёл искать новости) 🗞📰🗞');
    const job = schedule.scheduleJob('*/10 * * * *', function () {

    });

});

bot.launch();
