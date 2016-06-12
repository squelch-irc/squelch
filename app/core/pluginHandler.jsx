
const _ = require('lodash');
const State = require('../scripts/stores/state');
const StateWrapper = require('../api/stateWrapper');

const plugins = _(require('require-dir')('../plugins'))
    .values()
    .map(plugin => {
        return _(plugin)
            .keys()
            .map(key => {
                const initializedPlugin = plugin[key]();
                return _.extend({ name: key }, initializedPlugin);
            })
            .value();
    })
    .flatten()
    .value();

console.info(`Loaded plugins: ${_.map(plugins, 'name')}`);

class PluginHandler {
    static hasCommand(msg) {
        return _.startsWith(msg, '/');
    }

    static getCommandName(msg) {
        return msg.substr(1).split(' ')[0];
    }

    static getCommandArgs(msg) {
        return msg.substr(msg.split(' ')[0].length+1);
    }

    static getCommandByName(command) {
        const foundCommand = _.find(plugins, { name: command });
        return foundCommand && foundCommand.run ? foundCommand : null;
    }

    static hasValidCommand(msg) {
        const command = this.getCommandName(msg);
        return this.getCommandByName(command);
    }

    static _runCommand(command, opts = { msg: '', server: null, to: '' }) {
        const foundCommand = this.getCommandByName(command);
        const args = this.getCommandArgs(opts.msg);

        const irc = StateWrapper({
            state: State,
            server: opts.server,
            to: opts.to
        });

        return foundCommand.run(irc, args);
    }

    static runCommand(opts = { msg: '', server: null, to: '' }) {
        return this._runCommand(this.getCommandName(opts.msg), opts);
    }

    static loadUserMenu(user) {
        return _(plugins)
            .filter(plugin => plugin.userMenu)
            .map(plugin => plugin.userMenu(user))
            .value();
    }

    static loadChannelMenu(channel) {
        return _(plugins)
            .filter(plugin => plugin.channelMenu)
            .map(plugin => plugin.channelMenu(channel))
            .value();
    }

}

module.exports = PluginHandler;
