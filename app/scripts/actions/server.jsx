import ConfigStore from '../stores/config'

import _ from 'lodash';
import Client from 'squelch-client';

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

export var ServerEventAction = (context, payload, done) => {
    context.dispatch('SERVER_EVENT', payload);
    done();
};

/*
payload.config requires
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
export var AddServerAction = (context, payload, done) => {
    let config = context.getStore(ConfigStore).getState().config;
    let serverConfig = _.assign(
        {},
        DEFAULT_SERVER_OPTIONS,
        payload.config,
        HARDCODED_SERVER_OPTIONS
    );
    _.each(APP_SERVER_OPTIONS, (opt) => serverConfig[opt] = config[opt]);

    let server = new Client(serverConfig);
    server.onAny((data) => {
        context.executeAction(ServerEventAction, {
            type: server.event,
            server,
            data
        });
    });

    context.dispatch('ADD_SERVER', {server});
    done();
};

export var RemoveServerAction = (context, payload, done) => {
    context.dispatch('REMOVE_SERVER', payload);
    done();
};
