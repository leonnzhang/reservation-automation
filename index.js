const figlet = require('figlet');
const inquirer = require('inquirer');

const log = require('./util/log');
const config = require('./util/config');
const questions = require('./static/questions');
const captchaApi = require('./captcha/api');
const buttonIDS = require('./static/buttonIDS');
const book = require('./util/booking');

const profiles = require('./profiles.json');

const captchaGenerator = require('./util/captcha-gen');

start();

function start() {
  figlet('WELCOME TO --> MINTO AIO', (err, data) => {
    if (err) {
      log('Error!', 'error')
      log(err, 'dir')
      return;
    }
    process.stdout.write(data + "\n")
    prompt();
  })
}

function prompt() {
  inquirer.prompt(questions.firstMenu).then(results => {
    if(results.mode == 'config') {
      config();
    } else if(results.mode = 'reserve') {
      selectActivity();
    }
  })
}

function selectActivity() {
  inquirer.prompt(questions.secondMenu).then(results => {
    // turns on captcha api that collects all tokens
    captchaApi();
    // turn on puppeteer captcha generator that generates captcha tokens
    //captchaGenerator();

    if(results.activity == 'Cardio/Weight Room') {
      return 'cardio_weight_room'
    } else if(results.activity == 'Adult Volleyball') {
      return 'adult_volleyball'
    } else if(results.activity == 'Bootcamp - turf') {
      return 'bootcamp_turf'
    }
  }).then(activity => {
    log('You should start harvesting tokens now.','warn');
    inquirer.prompt(  {
      type: 'confirm',
      name: 'step',
      message: 'Y to begin immediately. N to exit.',
      default: false,
    }).then(data => {
      if(data.step === false) {
        process.exit(0);
      } else if(data.step === true) {
          for(let i = 0; i < profiles.length; i++) {
            book(buttonIDS[activity].buttonID, profiles[i], `0${i}`);
        }
      }
    })
  })
}