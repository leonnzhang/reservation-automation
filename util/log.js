require('console-stamp')(console, {
    format:':date(HH:MM:ss.1).cyan :label.yellow'
  });

function log(message, type) {
    switch(type) {
        case 'warn':
            console.warn(message);
            break;
        case 'error':
            console.error(message);
            break;
        case 'info':
            console.info(message)
            break;
        case 'dir':
            console.dir(message);
            break;
        case 'table':
            console.table(message);
            break;
        default:
            console.log(message);
    }
}

module.exports = log;