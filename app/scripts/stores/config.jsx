import _ from 'lodash';

import alt from '../alt';

import ConfigActions from '../actions/config';

class ConfigStore {
    constructor() {
        this.config = {};
        this.configDir = '.';

        this.bindListeners({
            handleUpdateConfig: ConfigActions.LOAD
        });
    }

    handleUpdateConfig(data) {
        _.assign(this.config, data.config || {});

        this.configDir = data.dir || this.configDir;
    }
}

export default alt.createStore(ConfigStore, 'ConfigStore');
