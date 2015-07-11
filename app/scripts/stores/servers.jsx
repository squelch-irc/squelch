import {ServerEventAction} from '../actions/server.jsx'
import ConfigStore from '../stores/config'

import Client from 'squelch-client';
import _ from 'lodash';
import {BaseStore} from 'fluxible/addons';

// Options for squelch-client that are always the same
// ...they just gotta be that way
const HARDCODED_SERVER_OPTIONS = {
    verbose: true,
    verboseError: false,
    autoNickChange: true,
    autoSplitMessage: true,
    messageDelay: 0,
    stripColors: false,
    stripStyles: false
};

// Options for squelch-client that can be set for all servers
const APP_SERVER_OPTIONS = [
    'autoRejoin',
    'autoReconnect',
    'autoReconnectTries',
    'reconnectDelay',
    'timeout'
];

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

const MUTATION_EVENTS = [
    'connect',
    'disconnect',
    'error',
    'nick',
    'join',
    'part',
    'kick',
    'quit',
    '+mode',
    '-mode',
    '+usermode',
    '-usermode'
];

class ServerStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.servers = {};
    }

    getState() {
        return {
            servers: this.servers
        };
    }

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
    _addServer(payload) {
        let config = this.dispatcher.getStore(ConfigStore).getState().config;
        let serverConfig = _.assign({}, DEFAULT_SERVER_OPTIONS, payload.config, HARDCODED_SERVER_OPTIONS);
        _.each(APP_SERVER_OPTIONS, (opt) => serverConfig[opt] = config[opt]);
        var id = _.uniqueId('server');
        var server = new Client(serverConfig);
        server.id = id;
        this.servers[id] = server;

        server.onAny((data) => {
            // TODO: FIGURE OUT HOW TO EXECUTE THIS ACTION!!!
            // this.getContext().executeAction(ServerEventAction, {
            //     type: server.event,
            //     data
            // });
            if (_.contains(MUTATION_EVENTS, server.event)) {
                this.emitChange();
            }
        });

        this.emitChange();
    }

    // Accepts either id or client.
    _removeServer(payload) {
        let server = this.servers[payload.id] || this.servers[payload.client.id];
        if (!server) {
            throw new Error(`Cannot remove ${(id instanceof Client) ? id.id : id}, it does not exist, or has already been removed. (Saving references to servers is highly discouraged, as it can lead to memory leaks.)`);
        }
        server.forceQuit();
        server.removeAllListeners();
        delete this.servers[id];

        this.emitChange();
    }
}

ServerStore.storeName = 'ServerStore';
ServerStore.handlers = {
    'ADD_SERVER': '_addServer',
    'REMOVE_SERVER': '_removeServer'
};

export default ServerStore;
