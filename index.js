require('dotenv').config();
const puppeteer = require('puppeteer');

const link = 'https://chr.rbc.ru/short_news';
const config = { 
    headless: true, 
    slowMo: 100, 
    devtools: true 
};

(async () => {
    const browser = await puppeteer.launch(config);
    const page = await browser.newPage();
    page.setViewport({width:320,height:640});
    await page.goto(link,{waitUntil:'domcontentloaded'});

    // let title = await page.title();

    let blocks = await page.evaluate(async ()=>{
        let list = [];
        const selectorlistClass = 'div.js-news-feed-item.js-yandex-counter';
        const titleClass = 'span.item__title';
        const linkClass = 'a.item__link';
        let containerList = await document.querySelectorAll(selectorlistClass);

        containerList.forEach((item)=>{
            let title = item.querySelector(titleClass).innerText;
            let link = item.querySelector(linkClass).href;

            list.push({title,link});
        });

        return list;
    });

    await console.log(blocks);

    await browser.close();
})();
// const test = process.env.APP_TEST;
// console.log('hello ' + test);