const State = require('../stores/state');

const { hashHistory }  = require('react-router');
const CommandRegistry = require('./commandRegistry');
const PackageManager = require('./packageManager');

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
        if(!serverId) throw new Error('Must provide serverId to Squelch.focus()');

        const server = State.get().servers[serverId];
        if(!server) throw new Error(`Unable to find server with id ${serverId}`);

        if(!target) return hashHistory.push(`/server/${serverId}`);

        const encodedTarget = encodeURIComponent(target);

        if(server.getClient().isChannel(target)) {
            return hashHistory.push(`/server/${serverId}/channel/${encodedTarget}`);
        }

        return hashHistory.push(`/server/${serverId}/user/${encodedTarget}`);
    }
};

Squelch.commands = new CommandRegistry(Squelch);
Squelch.packages = new PackageManager(Squelch);

module.exports = Squelch;
