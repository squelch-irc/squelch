const _ = require('lodash');

// Returns a route function for MESSAGE_ROUTES to a single target
// specified by a prop in the message. ("Target" is channel or user)
// If toProp is our own nick, route to fromProp instead
const toTargetProp = (toProp, fromProp) => {
    return (message, server) => {
        if(message[toProp] === server.getClient().nick()) {
            return { server: false, targets: [message[fromProp]] };
        }

        return { server: false, targets: [message[toProp]] };
    };
};

// A route function that routes to the server log only
const toServer = () => { return { server: true, targets: [] }; };

// A route function that routes to current view (if possible) and server log
// Also routes to user view if message.from exists
const toCurrentAndServer = (message) => {
    return {
        server: true,
        current: true,
        targets: (message.from) ? [message.from] : []
    };
};

// A route function that routes to all logs
const toAll = () => { return { all: true }; };

// A route function that routes nowhere
const ignore = () => { return {}; };

// Functions that return where a message type should be sent to
// Should return {all: boolean, server: boolean, targets: [], message: {}}
// If all is true, will route to all open logs, otherwise
// If server is true, will route to server view
// If current is true, will route to current view if possible
// If targets has strings, will route to those targets (channel or user)
// If message is specified, it will replace the original message.
const MESSAGE_ROUTES = {
    info: toCurrentAndServer,
    msg: toTargetProp('to', 'from'),
    action: toTargetProp('to', 'from'),
    notice: (message, server) => {
        if(message.to === server.getClient().nick()) {
            return toCurrentAndServer(message, server);
        }
        // Send notices like pre-connection notices only to server
        return { server: true };
    },
    invite: toCurrentAndServer,
    join: toTargetProp('chan'),
    part: toTargetProp('chan'),
    kick: toTargetProp('chan'),
    topic: toTargetProp('chan'),
    topicwho: toTargetProp('chan'),
    mode: toTargetProp('chan'),
    usermode: toServer,
    motd: toServer,
    nick: (message, server) => {
        if(message.me) {
            return { all: true };
        }

        let targets = _(server.channels)
        .keys()
        .filter((chan) => {
            return server.getClient().isInChannel(chan, message.newNick);
        })
        .value();

        if(server.userMessages[message.newNick]) {
            targets = targets.concat(message.newNick);
        }

        return {
            server: false,
            targets
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
    disconnect: (message) => {
        return {
            all: true,
            message: { type: 'info', msg: `Disconnected (${message.reason})` }
        };
    },
    quit: (message, server) => {
        let targets = message.channels;
        // Route to user if user window is open
        if(server.userMessages[message.nick]) {
            targets = targets.concat(message.nick);
        }
        return { targets };
    },
    error: toAll
};

const RAW_MESSAGE_ROUTES = {
    324: (message) => {
        return { targets: [message.params[1]], server: true };
    },
    '400-599': toCurrentAndServer,
    331: ignore,
    332: ignore,
    333: ignore,
    353: ignore,
    366: ignore,
    372: ignore,
    375: ignore,
    376: ignore,
    PING: ignore,
    PONG: ignore,
    PRIVMSG: ignore,
    NOTICE: ignore,
    JOIN: ignore,
    PART: ignore,
    KICK: ignore,
    MODE: ignore,
    NAMES: ignore,
    NICK: ignore,
    INVITE: ignore,
    ERROR: ignore,
    QUIT: ignore
};

const getKeyRange = require('get-key-range').bind(null, RAW_MESSAGE_ROUTES);

// This function takes a number and returns value in above RAW_MESSAGE_ROUTES
// that satisfies a key's range. Memoized because this runs often w/ same result
const getRawRoute = _.memoize((cmd) => RAW_MESSAGE_ROUTES[cmd] || getKeyRange(cmd));

const MESSAGE_LIMIT = 100;

// Append to a message log, respecting the message limit
const appendToLog = function(messages, message) {
    let log = messages.pivot();
    log = log.push(message);
    if(log.length > MESSAGE_LIMIT) {
        log = log.shift();
    }
    return log;
};

// Append to a userMessages log, creating it if it doesn't exist
const appendToUserLog = function(server, user, message) {
    let messages = server.userMessages;
    if(!server.userMessages[user]) {
        messages = server.userMessages.set(user, []);
    }
    return appendToLog(messages[user], message);
};

// Send message to correct log in state
const routeMessage = ({ message, server, current }) => {
    let route;
    // Match message against a message type
    if(MESSAGE_ROUTES[message.type]) {
        route = MESSAGE_ROUTES[message.type](message, server);
    }
    // Match message against a specific raw command number
    else if(message.type === 'raw' && getRawRoute(message.command)) {
        route = getRawRoute(message.command)(message, server);
    }

    // If we have a route defined for this type, send to the specified logs
    if(route) {
        if(route.message) {
            route.message.id = message.id;
            route.message.timestamp = message.timestamp;
        }

        message = route.message || message;

        if(route.all) {
            // Route to all: server, all channels, all open users
            appendToLog(server.messages, message);
            _.each(server.channels,
                chan => appendToLog(chan.messages, message)
            );
            _.each(server.userMessages,
                user => appendToLog(user, message)
            );
        }
        else {
            // Route to current if it's the same server
            if(route.current && server.id === current.serverId) {
                if(current.channel) {
                    appendToLog(server.channels[current.channel].messages, message);
                }
                if(current.user) {
                    appendToUserLog(server, current.user, message);
                }

            }

            // Route to server messages
            if(route.server) {
                appendToLog(server.messages, message);
            }

            // Route to specified targets
            _.each(route.targets, (target) => {
                // Target is a channel, route to channel log
                if(server.getClient().isChannel(target)) {
                    appendToLog(server.channels[target].messages, message);
                }
                // Target is a user, route to channel log
                else {
                    appendToUserLog(server, target, message);
                }
            });
        }

    }
    // Else, log to the server
    else if(message.type === 'raw') {
        appendToLog(server.messages, message);
    }

};

module.exports =  routeMessage;
