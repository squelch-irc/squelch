import _ from 'lodash';
import Immutable from 'immutable';

import alt from '../alt';

import ServerActions from '../actions/server';
import ChannelActions from '../actions/channel';

import ServerStore from './servers';
import RouteStore from './route';


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
                return server.client.isInChannel(chan, message.newNick);
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

const Messages = Immutable.Record({
    serverMessages: Immutable.List(),
    channels: Immutable.Map()
});

class MessageStore {
    constructor() {
        this.messages = Immutable.Map();

        this.bindListeners({
            newMessage: ServerActions.SERVER_EVENT,
            sendMessage: ChannelActions.SEND_MESSAGE
        });
    }

    newMessage(data) {
        this.waitFor([ServerStore, RouteStore]);


        const id = data.server.client.id;
        const server = data.server;
        const currentServerId = RouteStore.getState().routeState.params.serverId;
        const currentChannel = RouteStore.getState().routeState.params.channel;


        if(!this.messages.has(id)) {
            this.messages = this.messages.set(id, new Messages());
        }

        data.data.type = data.type;
        data.data.timestamp = Date.now();

        // If we have a route defined for this type, send to the
        // specified logs
        if(MESSAGE_ROUTES[data.type]) {
            const route = MESSAGE_ROUTES[data.type](
                data.data,
                server.channels.keySeq().toArray(),
                server
            );
            const message = route.message || data.data;
            if(route.all) {
                this._appendToLog([id, 'serverMessages'], message);
                this._appendToLog([id, 'channels'], message);
            }
            else {
                // Route to current if it's the same server
                // Don't route if current is server and we're already routing to server
                if(route.current && id === currentServerId
                    && !(route.server && !currentChannel)) {
                    this._appendToLog([id, 'channels', 'currentChannel'], message);
                }
                if(route.server) {
                    this._appendToLog([id, 'serverMessages'], message);
                }
                _.each(route.channels, (chan) => {
                    if(!this.messages.get(id).channels.has(chan)) {
                        this.messages = this.messages.setIn([id, 'channels', chan], Immutable.List());
                    }
                    this._appendToLog([id, 'channels', chan], message);
                });
            }

        }
        // Else, log to the server if it's not a blacklisted reply
        else {
            if(data.type === 'raw' && _.contains(RAW_COMMAND_BLACKLIST, data.data.command)) {
                return false;
            }
            this._appendToLog([id, 'serverMessages'], data.data);
        }
    }

    sendMessage(data) {
        this.waitFor(ServerStore);

        const server = ServerStore.getState().servers.get(data.serverId);

        server.client.msg(data.to, data.msg);

        setImmediate(() => {
            ServerActions.serverEvent({
                type: 'msg',
                server,
                data: {
                    to: data.to,
                    from: server.client.nick(),
                    msg: data.msg
                }
            });
        });
    }

    _appendToLog(path, message) {
        this.messages = this.messages.updateIn(path, (log) => {
            // Append to all logs in this Map
            if(log instanceof Immutable.Map) {
                return log.map((chanLog) => chanLog.withMutations((chanLog) => {
                    chanLog = chanLog.push(message);
                    if(chanLog.size > MESSAGE_LIMIT) {
                        chanLog = chanLog.shift();
                    }
                }));
            }
            // Just append to this log
            return log.withMutations((log) => {
                log = log.push(message);
                if(log.size > MESSAGE_LIMIT) {
                    log = log.shift();
                }
            });
        });
    }
}

export default alt.createStore(MessageStore, 'MessageStore');
