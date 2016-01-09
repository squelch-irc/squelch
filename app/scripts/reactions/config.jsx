import path from 'path';
import fs from 'fs-extra';
import Q from 'q';
import _ from 'lodash';

import ServerActions from '../actions/server';
import State from '../stores/state';

const CONFIG_NAME = 'config.json';
const DEFAULT_PATH = require('electron').remote.app.getPath('userData');
const DEFAULT_CONFIG = {
    servers: [],
    autoRejoin: false,
    autoReconnect: true,
    autoReconnectTries: 0,
    reconnectDelay: 5000,
    timeout: 60000
};

const CONFIG_PATHS = [
    '.',
    DEFAULT_PATH
];

State.on('config:load', () => {
    console.log('loading config');
    readConfig()

    .then((result) => {
        console.log('loaded config');
        State.get().set(result);

        _(result.config.servers)
        .filter('autoConnect')
        .each((serverConfig) => {
            // TODO: replace with add server reaction
            console.log('starting servre add action');
            ServerActions.add({ config: serverConfig });
        })
        .value();
    })

    .catch((err) => {
        console.error('Something went wrong while trying to load your config\n\n' + (err.message || err));
        throw err;
    })
    .done();
});

/**
* Locates and loads the user's config file.
* Returns a Promise that resolves with the config and dir, and rejects
* with the Error when trying to load it.
*/
const readConfig = (i = 0) => {
    const configPath = path.join(CONFIG_PATHS[i], CONFIG_NAME);

    return Q.nfcall(fs.readJson, configPath)

    .then((configJSON) => {
        // Successfully read file
        const config = configJSON;
        const configDir = path.resolve(CONFIG_PATHS[i]);
        return { config, configDir };
    })

    .catch((err) => {
        // Had different error than file not existing, HALT AND CATCH FIRE
        if(err.code !== 'ENOENT') {
            throw err;
        }
        // If no more locations,
        if(i + 1 === CONFIG_PATHS.length) {
            const config = DEFAULT_CONFIG;
            const configDir = path.resolve(DEFAULT_PATH);
            return { config, configDir };
        }
        return readConfig(++i);
    });
};
