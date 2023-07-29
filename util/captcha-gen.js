const puppeteer = require('puppeteer');
const settings = require('../static/settings');

const superagent = require('superagent').agent();

// formerly trackwalking url, now aquafit
//const home = "https://reservation.frontdesksuite.ca/rcfs/mintobarrhaven/ReserveTime/SlotCountSelection?pageId=69f7cf1e-4b39-4609-9cff-fe2deeb4c231&buttonId=6d7ecf73-c045-45d6-a4fa-20729f556eff&culture=en";

const home = 'https://reservation.frontdesksuite.ca/rcfs/mintobarrhaven/Home/Index?pageid=69f7cf1e-4b39-4609-9cff-fe2deeb4c231&culture=en&uiculture=en'

module.exports = async () => {
  console.log('Automatic Captcha Generator Started');
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  // goto home
  await page.goto(home);

  // currently volleyball you'll have to hotfix depending on what's avaiable at the time
  await page.goto('https://reservation.frontdesksuite.ca/rcfs/mintobarrhaven/ReserveTime/SlotCountSelection?pageId=69f7cf1e-4b39-4609-9cff-fe2deeb4c231&buttonId=4a4f5e85-cd46-44b6-84db-917d06eca9b2&culture=en')

  // submit reservation count, site default 1
  await page.click('#submit-btn');

  //await page.waitForNavigation();
  // submit earliest time of latest date, 7:00AM,7:15AM~
  //await page.waitForSelector('#mainForm > div.section.date-list.times-ampm > div > ul > li > a')

  //await page.waitForSelector('#mainForm > div.section.date-list.times-ampm > div:nth-child(1) > ul > li:nth-child(1) > a');
  //const button = await page.$('#mainForm > div.section.date-list.times-ampm > div:nth-child(1) > ul > li:nth-child(1) > a')

  //const button = await page.$('#mainForm > div.section.date-list.times-ampm > div:nth-child(2) > ul > li:nth-child(1) > a'); // ?
  //await button.evaluate(b => b.click())
  //await page.click('#mainForm > div.section.date-list.times-ampm > div:nth-child(1) > ul > li:nth-child(1) > a')

  //await page.waitForSelector('#mainForm > div.section.date-list.times-ampm > div > ul > li > a').then(x => log('exists!'))
  //await page.click('#mainForm > div.section.date-list.times-ampm > div > ul > li > a')

  
  setInterval(async () => {
    let token = await page.evaluate('document.querySelector("#g-recaptcha-response").getAttribute("value")')
    //console.log("TOKEN: " + token);
    addToken(token);
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  }, settings.captchaFarmDelay)

}


async function addToken(token) {
  const postToken = await superagent.post(`http://localhost:3000/add?token=${token}`).then(response => console.log("Response: " + response.text)).catch(err => console.log("Error posting: " + err))
}