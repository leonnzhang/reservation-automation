const inquirer = require('inquirer');

const fs = require('fs');
const log = require('./log');

function loadConfig() {
    if(fs.existsSync("./config.json")) {
        log('Found existing config file. Loading data from file now.', 'info');
        const config = require('../config.json')
        log(JSON.stringify(config), 'info')
    } else {
        log(`No config file exists. Let's create one now.`, 'info')
        setupConfig();
    }
}

function setupConfig() {
    inquirer.prompt([
        {
            name: 'name',
            message: 'Full name. <John Doe>',
            validate(val) {
                if(val.trim().match(/[a-z]/gi)) {
                    return true;
                }
                return "Please enter a valid name";
            }
        },
        {
            name: 'email',
            message: 'Email. <johndoe@gmail.com>',
            validate(val) {
                if(val.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                    return true;
                }
                return "Please enter a valid email address";
            }
        },
        {
            name: 'phone',
            message: 'Phone Number. <6134446666>',
            validate(val) {
                if(val.match(/^[0-9]{10}$/)) {
                    return true;
                }
                return "Please enter a valid phone number";
            }
        },
        {
            name: 'count',
            message: 'Reservation Count. <2>',
            validate(val) {
                if(!isNaN(parseFloat(val))) {
                    return true;
                }
                return "Please enter a number";
            }
        },
        {
            name: 'time',
            message: 'Time. <4:30PM>',
            validate(val) {
                if(val.toUpperCase().match(/^[0-9]{1,2}:[0-9]{2}[APM]{2}$/)) {
                    return true;
                }
                return "Please enter a valid time ie: 4:30PM";
            }
        }
    ]).then(result => {
        //console.log(result);

        fs.writeFile('config.json', JSON.stringify(result, null, 4), err => {
            if(err) {
                log(err, 'error')
            }
            log('Config generated.')
        })
        log(JSON.stringify(require('../config.json')), 'info')
    }).catch(err => {
        log(err,'error')
    })
}

module.exports = loadConfig;