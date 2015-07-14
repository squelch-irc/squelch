import _ from 'lodash';
import {BaseStore} from 'fluxible/addons';
import Client from 'squelch-client';

class ConfigStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.config = {};
        this.configDir = '.';
    }

    getState() {
        return {
            config: this.config,
            dir: this.configDir
        };
    }

    _setConfig(payload) {
        _.assign(this.config, payload.config || {});
        this.configDir = payload.dir || this.configDir;
        this.emitChange();
    }
}

ConfigStore.storeName = 'ConfigStore';
ConfigStore.handlers = {
    'SET_CONFIG': '_setConfig'
};

export default ConfigStore;
