import _ from 'lodash';

import alt from '../alt';

import ServerActions from '../actions/server';
import ChannelActions from '../actions/channel';

import ServerStore from './servers';

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

class MessageStore {
    constructor() {
        this.messages = {};

        this.bindListeners({
            newMessage: ServerActions.SERVER_EVENT,
            sendMessage: ChannelActions.SEND_MESSAGE
        });
    }

    newMessage(data) {
        const id = data.server.id || data.serverId;

        if(!this.messages[id]) {
            this.messages[id] = {
                serverMessages: [],
                channels: {}
            };
        }

        const msg = this.messages[id];

        data.data.type = data.type;
        data.data.timestamp = Date.now();

        let messages;

        const chanProp = CHANNEL_PROPERTIES[data.type];
        if(chanProp) {
            const channel = data.data[chanProp];
            if(!msg.channels[channel]) {
                msg.channels[channel] = [];
            }

            messages = msg.channels[channel];
        }
        else {
            if(data.type === 'raw' && _.contains(RAW_COMMAND_BLACKLIST, data.data.command)) {
                return;
            }
            messages = msg.serverMessages;
        }

        messages.unshift(data.data);
        messages.length = MESSAGE_LIMIT;
    }

    sendMessage(data) {
        this.waitFor(ServerStore);

        const server = ServerStore.getState().servers[data.serverId];

        server.msg(data.to, data.msg);

        setImmediate(() => {
            ServerActions.serverEvent({
                type: 'msg',
                server,
                data: {
                    to: data.to,
                    from: server.nick(),
                    msg: data.msg
                }
            });
        });
    }
}

export default alt.createStore(MessageStore, 'MessageStore');
