import _ from 'lodash';
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

// Raw message commands we should ignore either because they
// already have a parsed version or a user ain't wanna see that
const RAW_COMMAND_BLACKLIST = [
    'PING', 'PONG', 'PRIVMSG', 'NOTICE', 'JOIN', 'PART', 'KICK', 'MODE', '332', '333', '353', '366'
];

// TODO: properly route the following events
// connect, disconnect, error, nick, motd, quit, invite, +usermode?, -usermode?

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
            this.messages[id] = {
                serverMessages: [],
                channels: {}
            };
        }

        payload.data.type = payload.type;
        payload.data.timestamp = Date.now();

        const chanProp = CHANNEL_PROPERTIES[payload.type];
        if(chanProp) {
            const channel = payload.data[chanProp];
            if(!this.messages[id].channels[channel]) {
                this.messages[id].channels[channel] = [];
            }
            const messages = this.messages[id].channels[channel];

            messages.unshift(payload.data);
            messages.length = MESSAGE_LIMIT;
        }
        else {
            if(payload.type === 'raw' && _.contains(RAW_COMMAND_BLACKLIST, payload.data.command)) {
                return;
            }
            const messages = this.messages[id].serverMessages;

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
