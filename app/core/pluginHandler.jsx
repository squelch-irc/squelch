
import _ from 'lodash';
import State from '../scripts/stores/state';

const plugins = _(require('require-dir')('../plugins'))
    .values()
    .map(plugin => {
        return _(plugin)
            .keys()
            .map(key => {
                const initializedPlugin = plugin[key](State);
                return _.extend({ name: key }, initializedPlugin);
            })
            .value();
    })
    .flatten()
    .value();

console.info(`Loaded plugins: ${_.pluck(plugins, 'name')}`);

export default class PluginHandler {
    static hasCommand(msg) {
        return _.startsWith(msg, '/');
    }

    static getCommandName(msg) {
        return msg.substr(1).split(' ')[0];
    }

    static getCommandArgs(msg) {
        return msg.split(' ')[1];
    }

    static getCommandByName(command) {
        const foundCommand = _.findWhere(plugins, { name: command });
        return foundCommand && foundCommand.run ? foundCommand : null;
    }

    static hasValidCommand(msg) {
        const command = this.getCommandName(msg);
        return this.getCommandByName(command);
    }

    static _runCommand(command, args) {
        const foundCommand = this.getCommandByName(command);
        return foundCommand.run(args);
    }

    static runCommand(msg) {
        return this._runCommand(this.getCommandName(msg), this.getCommandArgs(msg));
    }
}

