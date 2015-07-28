import {BaseStore} from 'fluxible/addons';

// The property of event types that define what channel its for
const CHANNEL_PROPERTIES = {
    msg: 'to',
    action: 'to',
    notice: 'to',
    join: 'chan',
    part: 'chan',
    kick: 'chan',
    '+mode': 'chan',
    '-mode': 'chan',
    names: 'chan'
};

// TODO: properly route the following events
// connect, disconnect, error, nick, motd, quit, invite, +usermode?, -usermode?
// const CHAT_EVENTS = [
//     'action',
//     'msg'
// ];

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
        const id = payload.server.id || payload.serverId;
        if(!this.messages[id]) {
            this.messages[id] = {};
        }

        const chanProp = CHANNEL_PROPERTIES[payload.type];
        if(chanProp) {
            const channel = payload.data[chanProp];
            if(!this.messages[id][channel]) {
                this.messages[id][channel] = [];
            }
            const messages = this.messages[id][channel];

            payload.data.type = payload.type;
            payload.data.timestamp = Date.now();
            messages.unshift(payload.data);
            messages.length = MESSAGE_LIMIT;
        }

        this.emitChange();
    }
}

MessageStore.storeName = 'MessageStore';
MessageStore.handlers = {
    SERVER_EVENT: '_newMsg'
};

export default MessageStore;
