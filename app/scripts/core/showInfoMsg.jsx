const State = require('../stores/state');

const showInfoMsg = (msg) => {
    State.trigger('message:receive', {
        server: State.get().getCurrentServer(),
        type: 'info',
        data: { msg }
    });
};

module.exports =  showInfoMsg;
