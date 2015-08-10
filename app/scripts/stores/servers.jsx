import _ from 'lodash';
import Client from 'squelch-client';

import alt from '../alt';

import ServerActions from '../actions/server';

import ConfigStore from './config';

// Options for squelch-client that are always the same
// ...they just gotta be that way
const HARDCODED_SERVER_OPTIONS = {
    verbose: true,
    verboseError: true,
    autoNickChange: true,
    autoSplitMessage: true,
    messageDelay: 0,
    stripColors: false,
    stripStyles: false
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
        this.servers = {};

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

        const server = new Client(serverConfig);
        server.onAny((data) => {

            ServerActions.serverEvent({
                type: server.event,
                server,
                data
            });
        });

        const id = _.uniqueId('server');
        server.id = id;

        this.servers[id] = server;
    }

    // Accepts either id or client.
    removeServer(data) {
        const id = data.id || data.client.id;
        const server = this.servers[id];
        if(!server) {
            throw new Error(`Cannot remove ${id}, it does not exist, or has already been removed. (Saving references to servers is highly discouraged, as it can lead to memory leaks.)`);
        }
        server.forceQuit();
        server.removeAllListeners();
        delete this.servers[id];
    }

    handleMessage() {
        // noop
    }
}

export default alt.createStore(ServerStore);
