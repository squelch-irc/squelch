import _ from 'lodash';

import State from '../stores/state';

import PluginHandler from '../../core/pluginHandler';

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


State.on('message:receive', ({ server, type, data }) => {
    const state = State.get();
    const { route } = state;
    let { messages } = state;

    const { id } = server;
    const currentServerId = route.params.serverId;
    const currentChannel = route.params.channel;

    // TODO: create this on the 'server:add' event
    if(!messages[id]) {
        messages = messages.set(id, {
            serverMessages: [],
            channels: {}
        });
    }

    data.id = _.uniqueId();
    data.type = type;
    data.timestamp = new Date();

    // If we have a route defined for this type, send to the
    // specified logs
    if(MESSAGE_ROUTES[type]) {
        const route = MESSAGE_ROUTES[type](
            data,
            _.keys(server.channels),
            server
        );
        if(route.message) {
            route.message.id = data.id;
            route.message.timestamp = data.timestamp;
        }

        const message = route.message || data;

        if(route.all) {
            appendToLog(messages, [id, 'serverMessages'], message);
            appendToLog(messages, [id, 'channels'], message);
        }
        else {
            // Route to current if it's the same server
            // Don't route if current is server and we're already routing to server
            if(route.current && id === currentServerId
                && !(route.server && !currentChannel)) {
                appendToLog(messages, [id, 'channels', currentChannel], message);
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
    else if(type === 'raw' && !_.contains(RAW_COMMAND_BLACKLIST, data.command)) {
        appendToLog(messages, [id, 'serverMessages'], data);
    }

});


State.on('message:send', ({ serverId, to, msg }) => {
    const server = State.get().servers[serverId];

    if(PluginHandler.hasCommand(msg)) {
        if(PluginHandler.hasValidCommand(msg)) {
            msg = PluginHandler.runCommand({
                server,
                to,
                msg
            });

            // some commands may only send messages to the user
            if(!msg) return;

        } else {
            State.trigger('message:receive', {
                type: 'msg',
                server,
                data: {
                    msg: `${PluginHandler.getCommandName(msg)} is not a valid command.`,
                    to,
                    from: '**squelch**'
                }
            });

            return;
        }
    }

    server.getClient().msg(to, msg);
    State.trigger('message:receive', {
        type: 'msg',
        server,
        data: {
            msg,
            to,
            from: server.getClient().nick()
        }
    });
});
