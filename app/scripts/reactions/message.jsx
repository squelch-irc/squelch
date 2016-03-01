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
            message: { type: 'info', msg: 'Connected' }
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

const appendToLog = function(messages, message) {
    let log = messages.pivot();
    log = log.push(message);
    if(log.length > MESSAGE_LIMIT) {
        log = log.shift();
    }
    return log;
};


State.on('message:route', ({ server, type, data }) => {
    const state = State.get();
    const { route } = state;
    const { servers } = state;
    const { id } = server;
    const currentServerId = route.params.serverId;
    const currentChannel = route.params.channel;

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
            appendToLog(servers[id].messages, message);
            _.each(servers[id].channels,
                chan => appendToLog(chan.messages, message)
            );
        }
        else {
            // Route to current if it's the same server
            // Don't route if current is server
            // and we're already routing to server
            if(route.current && id === currentServerId
                && !(route.server && !currentChannel)) {
                appendToLog(servers[id].channels[currentChannel].messages, message);
            }
            if(route.server) {
                appendToLog(servers[id].messages, message);
            }
            _.each(route.channels, (chan) => {
                appendToLog(servers[id].channels[chan].messages, message);
            });
        }

    }
    // Else, log to the server if it's not a blacklisted reply
    else if(type === 'raw' && !_.includes(RAW_COMMAND_BLACKLIST, data.command)) {
        appendToLog(servers[id].messages, data);
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

        }
        else {
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
    State.trigger('message:route', {
        type: 'msg',
        server,
        data: {
            msg,
            to,
            from: server.getClient().nick()
        }
    });
});
