import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import Q from 'q';

const CONFIG_NAME = 'config.json';
const CONFIG_PATHS = [
    '.',
    require('remote').require('app').getPath('userData')
];

const DEFAULT_CONFIG = {
    servers: {},
    autoRejoin: false,
    autoReconnect: true,
    autoReconnectTries: 0,
    reconnectDelay: 5000,
    timeout: 60000
};

var config;
var configDir;

/**
* Locates and loads the user's config file.
* Should only need to call this once at start of application.
* Returns a Promise that resolves with the config, and rejects
* with the Error when trying to load it.
*/
var read = (i = 0) => {
    // Return the config if we already have it.
    if (config) {
        return Q.resolve(config);
    }
    var configPath = path.join(CONFIG_PATHS[i], CONFIG_NAME);
    return Q.nfcall(fs.readJson, configPath)
    .then((configJSON) => {
        // Successfully read file
        config = configJSON;
        configDir = path.resolve(CONFIG_PATHS[i]);
        return _.cloneDeep(config);
    })
    .catch((err) => {
        // Had different error than file not existing, HALT AND CATCH FIRE
        if (err.code !== 'ENOENT') {
            throw err;
        }
        // If no more locations,
        if (i + 1 == CONFIG_PATHS.length) {
            config = DEFAULT_CONFIG;
            configDir = path.resolve(CONFIG_PATHS[1]);
            return _.cloneDeep(config);
        } else {
            return read(++i);
        }
    });
};

// Writes config to where it was read from.
// Returns a Promise.
var write = () => {
    var configPath = path.join(configDir, CONFIG_NAME);
    return Q.nfcall(fs.outputFile, configPath, JSON.stringify(config, null, '\t'));
};

var getDir = () => configDir;

// Gets a cloned value of the requested config property
var get = (key) => _.cloneDeep(config[key]);

// Sets the config property and writes to file.
// Returns the promise of the write function.
var set = (key, value, save = true) => {
    config[key] = _.cloneDeep(value);
    if (save) {
        return write();
    }
};

export default {read, getDir, get, set, write}
