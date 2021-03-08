const puppeteer = require('puppeteer');

class Wrapper{
    constructor(param = null){
        if (param === null) {
            this.config = {
                headless: true,
                slowMo: 100,
                devtools: true
            }
        }else{
            this.config = param;
        }
    }

    async getBrowser(){
        this.browser =  await puppeteer.launch(this.config);
    }

    async closeBrowser(){
        await this.browser.close();
    }
}

module.exports = Wrapper;