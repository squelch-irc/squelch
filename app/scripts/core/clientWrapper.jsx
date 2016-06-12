const Squelch = require('./squelchGlobal');

module.exports =  () => (client) => {
    client.info = Squelch.showMsg;
};
