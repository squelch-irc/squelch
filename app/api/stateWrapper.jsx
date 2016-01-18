
import _ from 'lodash';

class StateWrapper {
    constructor(opts = { state: null, server: '', to: '' }) {
        _.extend(this, opts);
    }

    sendSystemMessage(msg, from = '**squelch**') {
        this.state.trigger('message:receive', {
            type: 'msg',
            server: this.server,
            data: {
                msg,
                to: this.to,
                from
            }
        });
    }
}

export default (opts) => new StateWrapper(opts);
