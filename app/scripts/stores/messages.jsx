import _ from 'lodash';

import alt from '../alt';

import ServerActions from '../actions/server';
import ChannelActions from '../actions/channel';

import ServerStore from './servers';


// Returns a route function for MESSAGE_ROUTES to a single channel
// specified by a prop in the message.
const toChannelProp = (prop) => {
    return (message) => {
        return { server: false, channels: [message[prop]] };
    };
};

// A route function that routes to the server log only
const toServer = () => { return { server: true, channels: [] }; };

// A route function that routes to all logs
const toAll = () => { return { all: true }; };

// Functions that return where a message type should be sent to
// Should return {all: boolean, server: boolean, channels: [], message: {}}
// If all is true, will route to all logs, otherwise
// If server is true, will route to server
// If channels has channels, will route to those channels
// If message is specified, it will replace the original message.
const MESSAGE_ROUTES = {
    msg: toChannelProp('to'),
    action: toChannelProp('to'),
    notice: toServer, // TODO: route this to current channel, too
    join: toChannelProp('chan'),
    part: toChannelProp('chan'),
    kick: toChannelProp('chan'),
    names: toChannelProp('chan'),
    topic: toChannelProp('chan'),
    topicwho: toChannelProp('chan'),
    mode: toChannelProp('chan'),
    usermode: toServer,
    nick: (message, channels, server) => {
        if(message.me) {
            return { all: true };
        }
        return {
            server: false,
            channels: _.filter(channels, (chan) => {
                return server.isInChannel(chan, message.newNick);
            })
        };
    },
    connecting: (message) => {
        return {
            server: true,
            message: { type: 'info', msg: `Connecting to ${message.server} on port ${message.port}...` }
        };
    },
    'connection-established': (message) => {
        return {
            server: true,
            message: { type: 'info', msg: `Connection to host at ${message.server} established` }
        };
    },
    connect: (message) => {
        return {
            server: true,
            message: { type: 'info', msg: `Connected` }
        };
    },
    reconnecting: (message) => {
        return {
            server: true,
            message: { type: 'info', msg: `Reconnecting in ${message.delay/1000} seconds (${message.triesLeft} tries remaining)...` }
        };
    }
};

// Raw message commands we should ignore either because they
// already have a parsed version or a user ain't wanna see that
const RAW_COMMAND_BLACKLIST = [
    'PING', 'PONG', 'PRIVMSG', 'NOTICE', 'JOIN', 'PART', 'KICK', 'MODE', 'NICK', '331', '332', '333', '353', '366', '372', '375', '376'
];

const MESSAGE_LIMIT = 100;
const appendToLog = (log, message) => {
    log.unshift(message);
    log.length = MESSAGE_LIMIT;
};


class MessageStore {
    constructor() {
        this.messages = {};

        this.bindListeners({
            newMessage: ServerActions.SERVER_EVENT,
            sendMessage: ChannelActions.SEND_MESSAGE
        });
    }

    newMessage(data) {
        this.waitFor(ServerStore);

        const id = data.server.id || data.serverId;
        const server = ServerStore.getState().servers[id];

        if(!this.messages[id]) {
            this.messages[id] = {
                serverMessages: [],
                channels: {}
            };
        }

        const messages = this.messages[id];

        data.data.type = data.type;
        data.data.timestamp = Date.now();

        // If we have a route defined for this type, send to the
        // specified logs
        if(MESSAGE_ROUTES[data.type]) {
            const route = MESSAGE_ROUTES[data.type](data.data, _.keys(messages.channels), server);
            const message = route.message || data.data;
            if(route.all) {
                appendToLog(messages.serverMessages, message);
                _.each(messages.channels, (msgs, chan) => {
                    appendToLog(messages.channels[chan], message);
                });
            }
            else {
                if(route.server) {
                    appendToLog(messages.serverMessages, message);
                }
                _.each(route.channels, (chan) => {
                    if(!messages.channels[chan]) {
                        messages.channels[chan] = [];
                    }
                    appendToLog(messages.channels[chan], message);
                });
            }

        }
        // Else, log to the server if it's not a blacklisted reply
        else {
            if(data.type === 'raw' && _.contains(RAW_COMMAND_BLACKLIST, data.data.command)) {
                return;
            }
            appendToLog(messages.serverMessages, data.data);
        }
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
