const sha512 = require('js-sha512');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
var userAgent = require('user-agents');   
puppeteer.use(StealthPlugin())

let CONTEST_GLOBO_URL = `https://especiais.g1.globo.com/economia/concursos-e-emprego/lista-de-concursos-publicos-e-vagas-de-emprego/`;

(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        headless: true, 
        args:['--no-sandbox'],
        ignoreHTTPSErrors:true,
    });

    const page = await browser.newPage()

    let loadData = async () => {
        try{
            await page.setUserAgent(userAgent.random().toString())

            await page.setViewport({ width: 1280, height: 1800 })
            await page.goto(CONTEST_GLOBO_URL,  { timeout: 120000 });

            const selectOptions = await page.evaluate(() => document.querySelector('.app').innerHTML);
            console.log(selectOptions)
            
            const allContests = await page.evaluate(() => {
                const allContests = []
                
                let allDataHeaders = document.querySelectorAll('tr')[0].querySelectorAll('th');

                document.querySelectorAll('tr').forEach(trData => {
                    let allData = trData.querySelectorAll('td');
                    if(allData.length > 0) {
                        let elementToAdd = {};
                        let elementLength = allData.length
                        for(let currentElement = 0; currentElement < elementLength - 1; currentElement++){
                            let elementNode = allData[currentElement];
                            if(allDataHeaders[currentElement]){
                                let equivalentField = allDataHeaders[currentElement].getAttribute('data-field');
                                elementToAdd[equivalentField] = elementNode.innerText;
                            }
                        }
                        
                        let GENERATED_ID_CONTENT = '';
                        Object.values(elementToAdd).map(value => GENERATED_ID_CONTENT += value);

                        allContests.push({
                            data: elementToAdd,
                            id: GENERATED_ID_CONTENT
                        });
                    }
                })

                return allContests;
            });
            
            allContestsWithId = {};
            allContests.map(({ id, data }) => {
                let GENERATED_ID = sha512.sha512_256(id);
                allContestsWithId[GENERATED_ID] = data;
            });

            console.log(allContestsWithId)
        } catch(e) {
            console.log("Error happened");
            console.log(e.message);
            await loadData()
        }
    }

    await loadData();

    await browser.close()
  })()