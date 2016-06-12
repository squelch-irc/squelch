
const _ = require('lodash');

class StateWrapper {
    constructor(opts = { state: null, server: '', to: '' }) {
        _.extend(this, opts);
    }

    sendSystemMessage(msg, from = '**squelch**') {
        this.state.trigger('message:route', {
            type: 'msg',
            server: this.server,
            data: {
                msg,
                to: this.to,
                from
            }
        });
    }

    // if a channel name does not start with & or #, prepend # to it
    fixChannelName(chanName) {
        if(_.startsWith(chanName, '#') || _.startsWith(chanName, '&')) return chanName;
        return `#${chanName}`;
    }
}

module.exports =  (opts) => new StateWrapper(opts);
