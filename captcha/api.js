const express = require('express');
const log = require('../util/log');

const app = express();

function captchaApi() {
    let tokens = [];

    app.post('/add', (req, res) => {
        if(req.query.token && req.query.token.length > 400) {
            tokens.push({ token: req.query.token, timestamp: new Date().getTime() } );
            res.status(201).send('Successfully added captcha token.');
            log('Successfully added captcha token.', 'info');
        } else {
            res.status(400).send('Please enter a valid captcha token.');
            log('Please enter a valid captcha token.', 'warn')
        }
    })
    
    app.get('/tokens', (req, res) => {
        for(let i = 0; i < tokens.length; i++) {
            if(new Date().getTime() - tokens[i].timestamp > 105000) {
                tokens.shift();
            }
        }
        res.json(tokens)
    })

    app.get('/token', (req, res) => {
        for(let i = 0; i < tokens.length; i++) {
            if(new Date().getTime() - tokens[i].timestamp > 105000) {
                tokens.shift();
            } else {
                let token = tokens.shift();
                res.send(token.token);
                log('Sent captcha token.', 'info')
                return;
            }
        }
        res.status(410).send('No more tokens remaining.')
    })
    
    app.listen('3000', () => {
        log('Captcha API started on port 3000', 'info')
    });
}

module.exports = captchaApi;