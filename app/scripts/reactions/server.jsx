const _ = require('lodash');
const Client = require('squelch-client');

const State = require('../stores/state');
const ClientWrapper = require('../core/clientWrapper');

// Options for squelch-client that are always the same
// ...they just gotta be that way
const HARDCODED_SERVER_OPTIONS = {
    verbose: true,
    verboseError: true,
    autoNickChange: true,
    autoSplitMessage: true,
    messageDelay: 0,
    stripColors: false,
    stripStyles: false,
    autoConnect: false,
    triggerEventsForOwnMessages: true
};

// Default options for servers
const DEFAULT_SERVER_OPTIONS = {
    port: 6667,
    nick: 'SquelchUser',
    username: 'SquelchUser',
    realname: 'SquelchUser',
    channels: [],
    ssl: false,
    selfSigned: false,
    certificateExpired: false
};

// Options for squelch-client that can be set for all servers
const APP_SERVER_OPTIONS = [
    'autoRejoin',
    'autoReconnect',
    'autoReconnectTries',
    'reconnectDelay',
    'timeout'
];

/*
config requires
    server
    port
    nick
    username
    realname
    channels
    ssl
    selfSigned
    certificateExpired
*/
State.on('server:add', ({ config }) => {
    const id = _.uniqueId('server');
    const state = State.get();
    const { servers } = state;
    const rootConfig = state.config;

    const serverConfig = _.assign(
        {},
        DEFAULT_SERVER_OPTIONS,
        config,
        HARDCODED_SERVER_OPTIONS
    );
    _.each(APP_SERVER_OPTIONS, (opt) => serverConfig[opt] = rootConfig[opt]);

    const client = new Client(serverConfig);
    client.use(ClientWrapper());
    // Monkeypatch .emit to catch all events
    client.emit = _.wrap(client.emit, (orig, event, data) => {
        State.trigger('message:receive', {
            type: event,
            server: State.get().servers[client.id],
            data
        });
        orig.call(client, event, data);
    });

    client.id = id;

    servers.set(client.id, {
        id,
        name: serverConfig.server || serverConfig.name,
        messages: [],
        userMessages: {},
        channels: {},
        connected: false,
        getClient: () => client
    });

    // Connect at the end because it will trigger a `message:receive` event
    client.connect(3);
});

/**
 * Removes a server. Accepts a server id, a server object, or irc client
 */
State.on('server:remove', ({ id, server, client }) => {
    id = id || server.id || client.id;
    server = State.get().servers[id];

    if(!server) throw new Error(`Cannot remove ${id}, it does not exist, or has already been removed. (Saving references to servers is highly discouraged, as it can lead to memory leaks.)`);

    client = server.getClient();
    client.forceQuit();
    client.removeAllListeners();

    State.get().servers().remove(id);
});

/**
 * Keep track of channels and users.
 */
State.on('message:receive', ({ type, server, data }) => {
    const client = server.getClient();
    const { id, channels, userMessages } = server;
    switch(type) {
        case 'connect':
            server.set('connected', true);
            break;

        case 'nick':
            _.each(channels, (channel) => {
                const user = channel.users[data.oldNick];
                channel.users
                .remove(data.oldNick)
                .set(data.newNick, user);
            });

            // Move userMessages to new nick
            if(userMessages[data.oldNick]) {
                userMessages
                .set(data.newNick, userMessages[data.oldNick])
                .remove(data.oldNick);
            }
            break;

        case 'join':
            if(data.me) {
                channels.set(data.chan, {
                    users: {},
                    mode: [],
                    messages: [],
                    topic: '',
                    joined: true
                });
            }
            else {
                channels[data.chan].users.set(data.nick, { status: '' });
            }
            break;

        case 'part':
        case 'kick':
            if(data.me) {
                channels[data.chan].set({
                    joined: false,
                    users: {},
                    mode: [],
                    topic: ''
                });
            }
            else {
                channels[data.chan].users.remove(data.nick);
            }
            break;

        case 'names':
            channels[data.chan].set('users', _.reduce(
                client.getChannel(data.chan).users(),
                (users, nick) =>  {
                    users[nick] = {
                        status: client.getChannel(data.chan).getStatus(nick)
                    };
                    return users;
                },
                {}
            ));
            break;

        case 'topic':
            channels[data.chan].set('topic', data.topic);
            break;

        case 'quit':
            _.each(channels, (channel) => channel.users.remove(data.nick));
            break;

        case '+mode':
            if(client.modeToPrefix(data.mode)) {
                channels[data.chan].users[data.param].set('status', client.modeToPrefix(data.mode));
            }
            else {
                channels[data.chan].mode.push(data.mode);
            }
            break;

        case '-mode':
            if(client.modeToPrefix(data.mode)) {
                channels[data.chan].users[data.param].set('status', '');
            }
            else {
                channels[data.chan].set('mode',
                    _.filter(channels[data.chan].mode, data.mode)
                );
            }
            break;

        case 'disconnect':
            server = server.set('connected', false);
            _.each(channels, (channel) => {
                channel.set({
                    joined: false,
                    users: {},
                    mode: [],
                    topic: ''
                });
            });
            break;
    }

    State.trigger('message:route', {
        type,
        data,
        server: State.get().servers[id]
    });
});

State.on('server:closeChannel', ({ serverId, channel }) => {
    const server = State.get().servers[serverId];
    const chan = server.channels[channel];

    if(chan.joined) {
        server.getClient().part(channel);
    }

    server.channels.remove(channel);
});
