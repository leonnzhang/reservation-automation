const superagent = require('superagent').agent();

async function getCaptcha() {
    return new Promise(async (resolve, reject) => {
        const token = await superagent.get('http://localhost:3000/token').then(res => {
            resolve(res.text);
            return;
        }).catch(err => {
            reject('no tokens');
            return;
        })
    })

}

module.exports = getCaptcha;