const Freezer = require('freezer-js');

const State = new Freezer({
    servers: {},
    config: {},
    configDir: '',
    route: { params: {} },
    theme: {},

    getCurrentServer() {
        return this.servers[this.route.params.serverId];
    },

    getCurrentTarget() {
        return this.route.params.channel || this.route.params.user;
    },

    isInServerView() {
        return this.getCurrentServer() && !this.getCurrentTarget();
    },

    isInChannelView() {
        return this.getCurrentServer() && this.route.params.channel;
    },

    isInQueryView() {
        return this.getCurrentServer() && this.route.params.user;
    }

    // TODO: refactor with the above 5 convenience functions
}, { live: false });

module.exports =  State;
