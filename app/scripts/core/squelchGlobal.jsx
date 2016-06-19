const State = require('../stores/state');

const { hashHistory }  = require('react-router');
const CommandRegistry = require('./commandRegistry');
const PackageManager = require('./packageManager');

const getServer = (serverId) => {
    if(!serverId) throw new Error('Must provide serverId');

    const server = State.get().servers[serverId];
    if(!server) throw new Error(`Unable to find server with id ${serverId}`);

    return server;
};

/**
 * Returns the target before this one in the server list
 * @param  {Object} server Server state (when target is still in the state)
 * @param  {string} target Target to get previous of
 * @return {string|undefined}   Returns the previous target, or null if there are no
 *                         other targets
 */
const getPrevTarget = (server, target) => {
    const targets = Object.keys(server.channels)
    .concat(Object.keys(server.userMessages));

    // No previous target exists, return undefined
    if(targets.length === 1) return;

    const index = targets.indexOf(target);

    // Target not found
    if(index === -1) return;

    const prevIndex = index === 0 ? targets.length - 1 : index - 1;
    return targets[prevIndex];
};

const Squelch = {
    /**
     * Show an info message in the current server.
     * @param  {String} msg The message to display
     */
    showMsg(msg) {
        State.trigger('message:receive', {
            server: State.get().getCurrentServer(),
            type: 'info',
            data: { msg }
        });
    },

    /**
     * Focus on the specified server, channel, or query view.
     * @param  {[String]} serverId The id of the server
     * @param  {String} target  The channel or user to focus on. If omitted, the
     *                          server view will be focused.
     */
    focus(serverId, target) {
        const server = getServer(serverId);

        if(!target) return hashHistory.push(`/server/${serverId}`);

        const encodedTarget = encodeURIComponent(target);

        if(server.getClient().isChannel(target)) {
            return hashHistory.push(`/server/${serverId}/channel/${encodedTarget}`);
        }

        return hashHistory.push(`/server/${serverId}/user/${encodedTarget}`);
    },

    /**
     * Closes the view of the target from the UI. If the target is a channel
     * the client is currently joined, then it will part the channel before
     * closing.
     * @param  {string} serverId The id of the server
     * @param  {string} target   A channel or user name
     */
    close(serverId, target) {
        const server = getServer(serverId);

        if(!target) throw new Error('Must specify target view to close');

        if(server.channels[target]) {
            if(server.channels[target].joined) {
                server.getClient().part(target)
                .then(() => server.channels.remove(target));
            }

            server.channels.remove(target);

            // Focus next channel or user
            if(target === State.get().route.params.channel) {
                this.focus(serverId, getPrevTarget(server, target));
            }
        }
        else if(server.userMessages[target]) {
            server.userMessages.remove(target);

            // Focus next channel or user
            if(target === State.get().route.params.user) {
                this.focus(serverId, getPrevTarget(server, target));
            }
        }
    },

    clear(serverId, target) {
        const server = getServer(serverId);

        if(!target) {
            server.set('messages', []);
        }
        else if(server.channels[target]) {
            server.channels[target].set('messages', []);
        }
        else if(server.userMessages[target]) {
            server.userMessages.set(target, []);
        }
    }

};

Squelch.commands = new CommandRegistry(Squelch);
Squelch.packages = new PackageManager(Squelch);

module.exports = Squelch;
