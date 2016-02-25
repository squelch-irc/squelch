import Freezer from 'freezer-js';

const State = new Freezer({
    servers: {},
    config: {},
    configDir: '',
    route: {},
    theme: {}
}, { live: false });

export default State;
