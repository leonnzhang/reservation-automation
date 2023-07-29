const cheerio = require('cheerio');

const superagent = require('superagent').agent();

//const gymHomeRedirect = `https://reservation.frontdesksuite.ca/rcfs/mintobarrhaven/ReserveTime/StartReservation?pageId=69f7cf1e-4b39-4609-9cff-fe2deeb4c231&buttonId=${buttonID}&culture=en&uiCulture=en`;
const spotPostRequest = "https://reservation.frontdesksuite.ca/rcfs/mintobarrhaven/ReserveTime/SubmitSlotCount?culture=en";
const timeSelectRequest = "https://reservation.frontdesksuite.ca/rcfs/mintobarrhaven/ReserveTime/SubmitTimeSelection?culture=en";
const submitURL = "https://reservation.frontdesksuite.ca/rcfs/mintobarrhaven/ReserveTime/SubmitContactInfo?culture=en"

//const settings = require('../config.json');
const log = require('./log');
const getCaptcha = require('../captcha/getCaptcha');
const sendWebhook = require('./webhook')
const settings = require('../static/settings');

const hook = `PASTE_WEBHOOK_HERE`

const loadSite = async (buttonID, info, taskID) => {
    log(`#${taskID} || Starting booking for ${info.name} at ${info.time}`,'info')
    // get page where they ask for spot count
    const sport = await superagent.get(`https://reservation.frontdesksuite.ca/rcfs/mintobarrhaven/ReserveTime/StartReservation?pageId=69f7cf1e-4b39-4609-9cff-fe2deeb4c231&buttonId=${buttonID}&culture=en&uiCulture=en`);

    let reqVerifyToken = '';

    let $ = cheerio.load(sport.text);

    // checks if it's too early or not
    if(sport.text.includes('No more available times')) {
        log(`#${taskID} || No times are available. Wait until 6PM.`,'warn');
        return;
    } else {
        // scrapes _Requestverification token from webpage
        reqVerifyToken = $('#mainForm > input[type=hidden]:nth-child(9)').attr('value');
    }
    const spotRedirectURL = sport.request.url;

    // post number of spots
    const spotCount = await superagent.post(spotPostRequest)
    .field('pageid',spotRedirectURL.split(/pageId=([^&]*)/gi)[1])
    .field('buttonid',spotRedirectURL.split(/buttonId=([^&]*)/gi)[1])
    .field('culture','en')
    .field('uiCulture','en')
    .field('ReservationCount',info.count)
    .field('__RequestVerificationToken',reqVerifyToken)

    let $$ = cheerio.load(spotCount.text);
    let times = [];
    let buttons = [];
    $$('#mainForm > div.section.date-list.times-ampm > div > ul').find('li > a').each((index, element) => {
        if($$(element).attr('onclick') !== 'return false;') {
            times.push($$(element).text().replace(/\s/g,''))
            buttons.push($$(element).attr('onclick').match(/\((.*?)\)/)[1].replaceAll(',','').replaceAll('"','').replaceAll(`'`,'').split(' '))
        }
    })
    // logs all available times
    //console.log("Available times:")
    //console.dir(times);
    //console.dir("All time buttons: " + buttons);

    let time = findDesiredTime(info.time, times);

    if(time === undefined) {
        checkSuccess('bad', info).catch(() => {
            log(`#${taskID} || Selected time is not available.`,'warn');
        });
    }
    
    const timeSelect = await superagent.post(timeSelectRequest)
    .field('pageid',spotRedirectURL.split(/pageId=([^&]*)/gi)[1])
    .field('buttonid',spotRedirectURL.split(/buttonId=([^&]*)/gi)[1])
    .field('culture','en')
    .field('uiCulture','en')
    .field('queueId',buttons[time][0]) // if error on this line the time you have is not available.
    .field('categoryId','')
    .field('dateTime',buttons[time][2])
    .field('timeHash',buttons[time][3])
    .field('reservationCount',info.count)
    .field('__RequestVerificationToken',reqVerifyToken)

    //console.log("timeSelect code: " + timeSelect.statusCode)

    await getCaptcha().then(async captchaToken => {
        const submitInfo = await superagent.post(submitURL)
        .field('pageid',spotRedirectURL.split(/pageId=([^&]*)/gi)[1])
        .field('buttonid',spotRedirectURL.split(/buttonId=([^&]*)/gi)[1])
        .field('culture','en')
        .field('uiCulture','en')
        .field('queueId',buttons[time][0])
        .field('categoryId','')
        .field('time','')
        .field('dateTime',buttons[time][2])
        .field('reservationCount',info.count)
        .field('g-recaptcha-response',captchaToken)
        .field('PhoneNumber',info.phone)
        .field('PhoneNumberCountryCallingCode',1)
        .field('PhoneNumberIso2CountryCode','ca')
        .field('Email',info.email)
        .field('field4201',info.name)
        .field('__RequestVerificationToken',reqVerifyToken)

        return submitInfo;
    }).then(submitInfo => {
        checkSuccess(submitInfo, info);
    }).catch(err => {
        checkSuccess('bad', info).catch(err => log(`#${taskID} || ${err}`, 'error'));
        log(err,'error');
    })
}

function findDesiredTime(time, times) {
    for(let i = times.length-1; i > -1; i--) {
        if(times[i] == time) {
            return i;
        }
    }
}

function checkSuccess(dom, data) {
    return new Promise((resolve, reject) => {
        if(dom === 'bad') {
            log('Internal Error!','error');
            sendWebhook(hook, data.name, data.email, data.time, 'Internal Error!');
            reject('internal error');
        } else if(dom.text.includes('confirmed')) {
            log('Success!','info');
            sendWebhook(hook, data.name, data.email, data.time, 'Success!');
            resolve('success');
        } else if(dom.text.includes('Retry')) {
            log('Failed recaptcha', 'warn');
            sendWebhook(hook, data.name, data.email, data.time, 'Failed');
            reject('captcha error')
        } else {
            log('Unknown error','error')
            sendWebhook(hook, data.name, data.email, data.time, 'Error');
            reject('unknown error');
        }
    });
}

module.exports = loadSite;