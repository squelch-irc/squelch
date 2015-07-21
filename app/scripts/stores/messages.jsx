import _ from 'lodash';
import {BaseStore} from 'fluxible/addons';

const CHAT_EVENTS = [
    'action',
    'msg'
];

const MESSAGE_LIMIT = 100;

class MessageStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.messages = {};
    }

    getState() {
        return {
            messages: this.messages
        };
    }

    _newMsg(payload) {
        if(!_.contains(CHAT_EVENTS, payload.type)) {
            return;
        }
        const id = payload.server.id;
        const channel = payload.data.to;
        if(!this.messages[id]) {
            this.messages[id] = {};
        }
        if(!this.messages[id][channel]) {
            this.messages[id][channel] = [];
        }

        const messages = this.messages[id][channel];
        messages.unshift({
            timestamp: Date.now(),
            sender: payload.data.from,
            message: payload.data.msg
        });
        messages.length = MESSAGE_LIMIT;

        this.emitChange();
    }
}

MessageStore.storeName = 'MessageStore';
MessageStore.handlers = {
    SERVER_EVENT: '_newMsg'
};

export default MessageStore;
