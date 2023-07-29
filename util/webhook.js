const superagent = require('superagent').agent();

async function sendWebhook(hook, name, email, time, type) {
    await superagent.post(hook)
        .send({
            "content": null,
            "embeds":[
                {
                "color": type === 'Success!' ? '65280' : '16711680',
                "fields": [
                {
                    "name":"Name",
                    "value": name,
                },
                {
                    "name":"Email",
                    "value":`||${email}||`
                },
                {
                    "name":"Time",
                    "value": time
                }
                ],
            "author": {
                "name": type
            },
            "footer": {
                "text":"lmaoo"
            },
            "timestamp": new Date(),
            }],
            "username":"github.com/leonnzhang"
        })
        .set({ 'content-type': 'application/json'})
        .then(() => {
            console.log('Successfully sent webhook.');
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = sendWebhook;