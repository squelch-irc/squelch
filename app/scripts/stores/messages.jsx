import _ from 'lodash';

import alt from '../alt';

import ServerActions from '../actions/server';
import ChannelActions from '../actions/channel';

import ServerStore from './servers';
import RouteStore from './route';
import State from './state';


// Returns a route function for MESSAGE_ROUTES to a single channel
// specified by a prop in the message.
const toChannelProp = (prop) => {
    return (message) => {
        return { server: false, channels: [message[prop]] };
    };
};

// A route function that routes to the server log only
const toServer = () => { return { server: true, channels: [] }; };

// A route function that routes to current view (if possible) and server log
const toCurrentAndServer = () => { return { server: true, current: true, channels: [] }; };

// A route function that routes to all logs
const toAll = () => { return { all: true }; };

// Functions that return where a message type should be sent to
// Should return {all: boolean, server: boolean, channels: [], message: {}}
// If all is true, will route to all logs, otherwise
// If server is true, will route to server
// If current is true, will route to current view if possible
// If channels has channels, will route to those channels
// If message is specified, it will replace the original message.
const MESSAGE_ROUTES = {
    msg: toChannelProp('to'),
    action: toChannelProp('to'),
    notice: toCurrentAndServer,
    invite: toCurrentAndServer,
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
                return server.getClient().isInChannel(chan, message.newNick);
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
    connect: () => {
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
    },
    disconnect: () => {
        return {
            all: true,
            message: { type: 'info', msg: 'Disconnected' }
        };
    },
    quit: (message) => {
        return {
            channels: message.channels
        };
    },
    error: toAll
};

// Raw message commands we should ignore either because they
// already have a parsed version or a user ain't wanna see that
const RAW_COMMAND_BLACKLIST = [
    'PING', 'PONG', 'PRIVMSG', 'NOTICE', 'JOIN', 'PART', 'KICK', 'MODE', 'NICK', 'INVITE', 'ERROR', 'QUIT', '331', '332', '333', '353', '366', '372', '375', '376'
];
const MESSAGE_LIMIT = 100;

const appendToLog = function(messages, path, message) {
    let log = _.get(messages, path).pivot();
    if(log instanceof Array) {
        log = log.push(message);
        if(log.length > MESSAGE_LIMIT) {
            log = log.shift();
        }
        return log;
    }

    // Else log is object of arrays
    log = _.reduce(log, (log, chanLog, chan) => {
        log = log[chan].push(message);
        if(log[chan].length > MESSAGE_LIMIT) {
            log = log[chan].shift();
        }
        return log;
    }, log);
    return _.get(messages, path.slice(0, path.length-1))
    .set(path[path.length-1], log);
};

class MessageStore {
    constructor() {
        const self = this;
        this.messages = State.get().messages;

        State.on('update', () => {
            self.setState({ messages: State.get().messages });
            self.emitChange();
        });

        this.bindListeners({
            newMessage: ServerActions.SERVER_EVENT,
            sendMessage: ChannelActions.SEND_MESSAGE
        });
    }

    newMessage(data) {
        this.waitFor([ServerStore, RouteStore]);


        const { id } = data.server;
        const server = data.server;
        const currentServerId = RouteStore.getState().routeState.params.serverId;
        const currentChannel = RouteStore.getState().routeState.params.channel;

        let messages = State.get().messages;

        if(!messages[id]) {
            messages = messages.set(id, {
                serverMessages: [],
                channels: {}
            });
        }

        data.data.type = data.type;
        data.data.timestamp = Date.now();

        // If we have a route defined for this type, send to the
        // specified logs
        if(MESSAGE_ROUTES[data.type]) {
            const route = MESSAGE_ROUTES[data.type](
                data.data,
                _.keys(server.channels),
                server
            );
            const message = route.message || data.data;
            if(route.all) {
                appendToLog(messages, [id, 'serverMessages'], message);
                appendToLog(messages, [id, 'channels'], message);
            }
            else {
                // Route to current if it's the same server
                // Don't route if current is server and we're already routing to server
                if(route.current && id === currentServerId
                    && !(route.server && !currentChannel)) {
                    appendToLog(messages, [id, 'channels', 'currentChannel'], message);
                }
                if(route.server) {
                    appendToLog(messages, [id, 'serverMessages'], message);
                }
                _.each(route.channels, (chan) => {
                    if(!messages[id].channels[chan]) {
                        messages[id].channels.set(chan, []);
                        messages = State.get().messages; // update state
                    }
                    appendToLog(messages, [id, 'channels', chan], message);
                });
            }

        }
        // Else, log to the server if it's not a blacklisted reply
        else {
            if(data.type === 'raw' && _.contains(RAW_COMMAND_BLACKLIST, data.data.command)) {
                return false;
            }
            appendToLog(messages, [id, 'serverMessages'], data.data);
        }

    }

    sendMessage(data) {
        this.waitFor(ServerStore);

        const server = ServerStore.getState().servers[data.serverId];

        server.getClient().msg(data.to, data.msg);

        setImmediate(() => {
            ServerActions.serverEvent({
                type: 'msg',
                server,
                data: {
                    to: data.to,
                    from: server.getClient().nick(),
                    msg: data.msg
                }
            });
        });
    }
}

export default alt.createStore(MessageStore, 'MessageStore');
