import Freezer from 'freezer-js';

const State = new Freezer({
    servers: {},
    config: {},
    configDir: '',
    route: { params: {} },
    theme: {}
}, { live: false });

export default State;
