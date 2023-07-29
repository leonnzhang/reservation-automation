const superagent = require('superagent').agent();

async function getToken() {
    return await superagent.get('http://localhost:3000/token');
}
module.export = getToken;