import _ from 'lodash';
import Client from 'squelch-client';

import alt from '../alt';

import ServerActions from '../actions/server';

import State from './state';

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

class ServerStore {
    constructor() {
        const self = this;
        // Clients are stored separately so they don't get
        // frozen in the Freezer state
        this.clients = {};
        this.servers = State.get().servers;

        State.on('update', () => {
            self.setState({ servers: State.get().servers });
            self.emitChange();
        });

        this.bindListeners({
            addServer: ServerActions.ADD,
            removeServer: ServerActions.REMOVE,
            handleMessage: ServerActions.SERVER_EVENT
        });
    }

    addServer(data) {
        const { config, servers } = State.get();

        const serverConfig = _.assign(
            {},
            DEFAULT_SERVER_OPTIONS,
            data.config,
            HARDCODED_SERVER_OPTIONS
        );
        _.each(APP_SERVER_OPTIONS, (opt) => serverConfig[opt] = config[opt]);

        const client = new Client(serverConfig);
        client.onAny((data) => {
            ServerActions.serverEvent({
                type: client.event,
                server: State.get().servers[client.id],
                data
            });
        });

        // Defer connection because it will try to dispatch a serverEvent action
        setImmediate(() => { client.connect(3); });

        client.id = data.id;

        this.clients[client.id] = client;
        servers.set(client.id, {
            id: data.id,
            channels: {},
            getClient: () => this.clients[client.id]
        });
    }

    removeServer({ id }) {
        const server = State.get().servers[id];
        const client = this.clients[id];
        if(!server || !client) {
            throw new Error(`Cannot remove ${id}, it does not exist, or has already been removed. (Saving references to servers is highly discouraged, as it can lead to memory leaks.)`);
        }
        client.forceQuit();
        client.removeAllListeners();
        delete this.clients[id];
        State.get().servers().remove(id);
    }

    handleMessage({ type, server, data }) {
        const client = server.getClient();
        const { id } = server;
        const channels = State.get().servers[id].channels;
        channels.transact();

        switch(type) {
            case 'nick':
                _.each(channels, (channel) => {
                    const user = channel.users[data.oldNick];
                    channel.users
                    .remove(data.oldNick)
                    .set(data.newNick, user);
                });
                break;
            case 'join':
                if(data.me) {
                    channels.set(data.chan, { users: {}, mode: [] });
                }
                else {
                    channels[data.chan].users.set(data.nick, { status: '' });
                }
                break;
            case 'part':
            case 'kick':
                if(data.me) {
                    channels.remove(data.chan);
                }
                else {
                    channels[data.chan].users.remove(data.nick);
                }
                break;
            case 'names':
                const chan = client.getChannel(data.chan);
                channels[data.chan].set('users', _.reduce(
                    chan.users(),
                    (users, nick) =>  {
                        users[nick] = { status: chan.getStatus(nick) };
                        return users;
                    },
                    {}
                ));
                break;
            case 'quit':
                _.each(channels, (channel) => channel.users.remove(data.nick));
                break;
            case '+mode':
                // TODO: don't use client._, see squelch-client issue #25
                if(client._.prefix[data.mode]) {
                    channels[data.chan].users[data.param].set('status', client._.prefix[data.mode]);
                }
                else {
                    channels[data.chan].mode.push(data.mode);
                }
                break;
            case '-mode':
                if(client._.prefix[data.mode]) {
                    channels[data.chan].users[data.param].set('status', '');
                }
                else {
                    channels[data.chan].set('mode',
                        _.filter(channels[data.chan].mode, data.mode)
                    );
                }
                break;
        }

        channels.run();
        // Don't trigger update until Freezer Store updates
        return false;
    }
}

export default alt.createStore(ServerStore);
