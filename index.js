require('dotenv').config();
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const { Telegraf } = require('telegraf');

const link = 'https://chr.rbc.ru/short_news';
const config = { 
    headless: true, 
    slowMo: 100, 
    devtools: true 
};

const bot = new Telegraf(process.env.TOKEN);

bot.start((ctx) => {
    console.log('start');
    ctx.reply('О! Я ушёл искать новости) 🗞📰🗞');
    const job = schedule.scheduleJob('*/10 * * * *', function () {

        (async () => {
            const browser = await puppeteer.launch(config);
            const page = await browser.newPage();
            page.setViewport({ width: 320, height: 640 });
            await page.goto(link, { waitUntil: 'domcontentloaded' });

            // let title = await page.title();

            let blocks = await page.evaluate(async () => {
                let list = [];
                const selectorlistClass = 'div.js-news-feed-item.js-yandex-counter';
                const titleClass = 'span.item__title';
                const linkClass = 'a.item__link';
                let containerList = await document.querySelectorAll(selectorlistClass);

                containerList.forEach((item) => {
                    let title = item.querySelector(titleClass).innerText;
                    let link = item.querySelector(linkClass).href;

                    list.push({ title, link });
                });

                return list;
            });

            await blocks.forEach((elem)=>{
                // ctx.reply('my text');
                let text = elem.title + ' [🗞 посмотреть](' + elem.link +'.)';
                // ctx.reply('🗞 ' + elem.title);
                ctx.replyWithMarkdownV2(text);
            });
            // await console.log(blocks);

            await browser.close();
        })();

        // console.log('The answer to life, the universe, and everything!');
    });

});

bot.launch();
