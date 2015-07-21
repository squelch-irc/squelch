import fs from 'fs-extra';
import path from 'path';
import Q from 'q';
import _ from 'lodash';

import {AddServerAction} from './server';
import ConfigStore from '../stores/config';

const CONFIG_NAME = 'config.json';
const CONFIG_PATHS = [
    '.',
    require('remote').require('app').getPath('userData')
];
const DEFAULT_CONFIG = {
    servers: [],
    autoRejoin: false,
    autoReconnect: true,
    autoReconnectTries: 0,
    reconnectDelay: 5000,
    timeout: 60000
};

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
        const dir = path.resolve(CONFIG_PATHS[i]);
        return {config, dir};
    })
    .catch((err) => {
        // Had different error than file not existing, HALT AND CATCH FIRE
        if(err.code !== 'ENOENT') {
            throw err;
        }
        // If no more locations,
        if(i + 1 === CONFIG_PATHS.length) {
            const config = DEFAULT_CONFIG;
            const dir = path.resolve(CONFIG_PATHS[1]);
            return {config, dir};
        }
        return readConfig(++i);
    });
};

export const ConfigLoadAction = (context, payload, done) => {
    readConfig().then((result) => {
        context.dispatch('SET_CONFIG', result);
        _.each(result.config.servers, (serverConfig) => {
            if (serverConfig.autoConnect) {
                context.executeAction(AddServerAction, {config: serverConfig});
            }
        });
        done();
    })
    .catch((err) => {
        console.error('Something went wrong while trying to load your config\n\n' + (err.message || err));
        console.error(err);
        // require('remote').process.exit(1);
    })
    .done();
};

export const ConfigSetAction = (context, payload) => {
    context.dispatch('SET_CONFIG', payload);
    const state = context.getStore(ConfigStore).getState();
    const configPath = path.join(state.dir, CONFIG_NAME);
    return Q.nfcall(fs.outputFile, configPath, JSON.stringify(state.config, null, '\t'));
};
