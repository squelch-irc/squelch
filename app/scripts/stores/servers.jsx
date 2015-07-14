import _ from 'lodash';
import {BaseStore} from 'fluxible/addons';

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

    _addServer(payload) {
        let server = payload.server
        let id = _.uniqueId('server');
        server.id = id;
        this.servers[id] = server;

        server.onAny((data) => {
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
