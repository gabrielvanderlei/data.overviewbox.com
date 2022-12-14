
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

let CONTEST_GLOBO_URL = `https://www.google.com`;

(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        headless: true, 
        args:['--no-sandbox'],
        ignoreHTTPSErrors:true,
    });

    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');

    await page.setViewport({ width: 1280, height: 1800 })
    await page.goto(CONTEST_GLOBO_URL)
    await page.waitForTimeout(10000)

    const selectOptions = await page.$$eval('td', options => { return options.map(option => option) })
    console.log(selectOptions)
  
    await browser.close()
  })()