import Client from 'squelch-client';
import _ from 'lodash';
import {EventEmitter2} from 'eventemitter2';
import config from './config';

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

export default class ServerManager extends EventEmitter2{
    constructor() {
        super({
            wildcard: true,
            delimiter: '::',
            newListener: false
        });
        this.setMaxListeners(0);
        this.servers = {};
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
    addServer(serverConfig) {
        serverConfig = _.assign({}, DEFAULT_SERVER_OPTIONS, serverConfig);
        _.assign(serverConfig, HARDCODED_SERVER_OPTIONS);
        _.each(APP_SERVER_OPTIONS, (opt) => serverConfig[opt] = config.get(opt));
        var id = _.uniqueId('server');
        var server = new Client(serverConfig);
        server.id = id;
        this.servers[id] = server;
        server.onAny((data) => {
            data = _.assign({}, data);
            data.client = server;
            this.emit(server.event, data);
        });
        this.emit('addServer', server);
        return server;
    }

    getServer(id) {
        return this.servers[id];
    }

    getServers() {
        return _.values(this.servers);
    }

    // Accepts either a server's id or the server itself
    // Will disconnect server if not disconnected.
    removeServer(id) {
        let server = (id instanceof Client) ? id : this.servers[id];
        if (!server) {
            throw new Error(`Cannot remove ${(id instanceof Client) ? id.id : id}, it does not exist, or has already been removed. (Saving references to servers is highly discouraged, as it can lead to memory leaks.)`);
        }
        server.forceQuit();
        server.removeAllListeners();
        delete this.servers[id];
        this.emit('removeServer', server);
    }
}
