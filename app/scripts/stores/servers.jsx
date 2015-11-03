import _ from 'lodash';
import Client from 'squelch-client';

import alt from '../alt';

import ServerActions from '../actions/server';

import ConfigStore from './config';

import Immutable from 'immutable';

const Server = Immutable.Record({
    client: null,
    channels: Immutable.Map()
});

const Channel = Immutable.Record({
    users: Immutable.Map()
});

const User = Immutable.Record({
    status: ''
});

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
        this.servers = Immutable.Map();

        this.bindListeners({
            addServer: ServerActions.ADD,
            removeServer: ServerActions.REMOVE,
            handleMessage: ServerActions.SERVER_EVENT
        });
    }

    addServer(data) {
        this.waitFor(ConfigStore);
        const { config } = ConfigStore.getState();

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
                server: this.servers.get(client.id),
                data
            });
        });

        // Defer connection because it will try to dispatch a serverEvent action
        setImmediate(() => { client.connect(3); });

        client.id = data.id;

        this.servers = this.servers.set(client.id, new Server({
            client,
            channels: Immutable.Map()
        }));
    }

    removeServer({ id }) {
        const server = this.servers.get(id);
        if(!server) {
            throw new Error(`Cannot remove ${id}, it does not exist, or has already been removed. (Saving references to servers is highly discouraged, as it can lead to memory leaks.)`);
        }
        server.client.forceQuit();
        server.client.removeAllListeners();
        this.servers = this.servers.delete(id);
    }

    handleMessage({ type, server, data }) {

        const id = server.client.id;
        const client = this.servers.get(id).client;
        switch(type) {
            case 'nick':
                this.servers = this.servers.updateIn([id, 'channels'], (channels) =>
                    channels.map((channel) =>
                        channel.withMutations((channel) => {
                            const user = channel.users.get(data.oldNick);
                            channel
                            .deleteIn(['users', data.oldNick])
                            .setIn(['users', data.newNick], user);
                        })
                    )
                );
                break;
            case 'join':
                if(data.me) {
                    this.servers = this.servers.setIn([id, 'channels', data.chan], new Channel());
                }
                else {
                    this.servers = this.servers.setIn([id, 'channels', data.chan, 'users', data.nick], new User());
                }
                break;
            case 'part':
            case 'kick':
                if(data.me) {
                    this.servers = this.servers.deleteIn([id, 'channels', data.chan]);
                }
                else {
                    this.servers = this.servers.deleteIn([id, 'channels', data.chan, 'users', data.nick]);
                }
                break;
            case 'names':
                const chan = client.getChannel(data.chan);
                const users = Immutable.Map().withMutations((users) => {
                    _.each(chan.users(), (user) => {
                        users.set(user, new User({ status: chan.getStatus(user) }));
                    });
                });
                this.servers = this.servers.setIn([id, 'channels', data.chan, 'users'], users);
                break;
            case 'quit':
                const channels = this.servers.get(id).channels.withMutations((channels) => {
                    _.each(data.channels, (chan) => {
                        channels.deleteIn([chan, 'users', data.nick]);
                    });
                });

                this.servers = this.servers.setIn([id, 'channels'], channels);
                break;
            case '+mode':
                if(client._.prefix[data.mode]) {
                    this.servers = this.servers.setIn([id, 'channels', data.chan, 'users', data.param, 'status'], client._.prefix[data.mode]);
                }
                // TODO: else set channel mode
                break;
            case '-mode':
                if(client._.prefix[data.mode]) {
                    this.servers = this.servers.setIn([id, 'channels', data.chan, 'users', data.param, 'status'], '');
                }
                // TODO: else set channel mode
                break;
            default:
                return false;
        }
    }
}

export default alt.createStore(ServerStore);
