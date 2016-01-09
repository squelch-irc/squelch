import Freezer from 'freezer-js';

const State = new Freezer({
    servers: {},
    messages: {},
    config: {},
    configDir: ''
}, { live: false });

export default State;
