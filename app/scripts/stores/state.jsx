import Freezer from 'freezer-js';

const State = new Freezer({
    servers: {},
    messages: {},
    config: {},
    configDir: '',
    route: {},
    theme: {}
}, { live: false });

export default State;
