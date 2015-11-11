import Freezer from 'freezer-js';

const State = new Freezer({
    servers: {},
    messages: {}
}, { live: false });

export default State;
