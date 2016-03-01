import _ from 'lodash';
import Client from 'squelch-client';

import State from '../stores/state';

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
    autoConnect: false
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
    client.onAny((event, data) => {
        State.trigger('message:receive', {
            type: event,
            server: State.get().servers[client.id],
            data
        });
    });

    client.id = id;

    servers.set(client.id, {
        id,
        messages: [],
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
    const { id } = server;
    const channels = State.get().servers[id].channels;

    // Predefine this variable if any cases need it below
    let transactChans;

    switch(type) {
        case 'connect':
            State.get().servers[id].set('connected', true);
            break;
        case 'nick':
            transactChans = channels.transact();
            _.each(transactChans, (channel) => {
                const user = channel.users[data.oldNick];
                channel.users
                .remove(data.oldNick)
                .set(data.newNick, user);
            });
            channels.run();
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
            transactChans = channels.transact();
            _.each(transactChans, (channel) => {
                channel.set({
                    joined: false,
                    users: {},
                    mode: [],
                    topic: ''
                });
            });
            channels.run();
            State.get().servers[id].set('connected', false);
            break;
    }
    State.trigger('message:route', { type, server, data });
});

State.on('server:closeChannel', ({ serverId, channel }) => {
    const server = State.get().servers[serverId];
    const chan = server.channels[channel];

    if(chan.joined) {
        server.getClient().part(channel);
    }

    server.channels.remove(channel);
});
