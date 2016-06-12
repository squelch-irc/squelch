import { Disposable } from 'event-kit';
import _ from 'lodash';

import State from '../stores/state';
import Squelch from './squelchGlobal';

export default class CommandRegistry {
    constructor() {
        this.commands = {};
    }

    /**
     * Adds a command to the registry.
     * @param  {string}   name The name that will trigger the command ("msg"
     *                         triggers on /msg)
     * @param  {Function} fn   Callback to invoke with args and event info.
     *                         If the callback returns a string, it will be sent
     *                         as a message in channels or query windows, or
     *                         shown as an info message on the server view.
     *
     * @return {Disposable} A disposable that will unregister the command when
     *                        disposed.
     */
    register(name, fn, opts = {}) {
        if(this.commands[name]) {
            throw new Error(`Command name conflict: a command has already registered under "${name}".`);
        }

        opts.fn = fn;
        this.commands[name] = opts;
        return new Disposable(() => this.unregister(name));
    }

    /**
     * Removes a command from the registry.
     * NOTE: it is preferred to hold on to the Disposable returned by
     * CommandRegistry.register and dispose that instead of calling this
     * directly
     * @param  {string} name Name of the command.
     */
    unregister(name) {
        delete this.commands[name];
    }

    /**
     * Invokes a command with given arguments. If the command hasn't been
     * registered, it will attempt to send the command to the server as a raw
     * command. (Ex: "/badcmd abc" will send "BADCMD abc" to the server.
     * @param  {string} name The command to invoke
     * @param  {string} args The arguments to pass to the command. This will
     *                       be the entire string after the command name.
     *                       (Ex: in `/msg friend hello!`, args will be
     *                       "friend hello")
     *
     * @return {[type]}      [description]
     */
    dispatch(name, args) {
        const command = this.commands[name];
        const context = this._getCommandContext();

        // If command doesn't exist, send raw message to server
        if(!command) {
            context.client.raw(`${name.toUpperCase()} ${args}`, false);
            return;
        }

        const result = command.fn(args, context);

        if(typeof result !== 'string') return;

        // If there's a result, send as msg (or info msg on servers)
        if(context.target) {
            context.client.msg(context.target, result);
        }
        else {
            Squelch.showMsg(result);
        }
    }

    /**
     * Gets the context for command dispatches
     * @return {Object} The context
     *             {Object} server The current state of the current server. This
     *                             is an immutable object.
     *             {string} target The current channel or user in focus.
     *             {IRCClient} client The client of the current server. Use this
     *                                to interact with the server.
     */
    _getCommandContext() {
        const state = State.get();
        const server = state.getCurrentServer();
        return {
            server,
            target: state.getCurrentTarget(),
            client: server.getClient()
        };
    }

    hasCommand(msg) {
        return _.startsWith(msg, '/');
    }

    /**
     * Parse the command name and arguments from a string
     * @param  {string} msg The command message to parse
     * @return {(Object|null)} Object with `name`, and `args` if msg is a valid
     *                         command, otherwise null
     */
    parseCommand(msg) {
        if(!this.hasCommand(msg)) return null;

        const split = msg.substring(1).split(' ');
        return {
            name: split[0],
            args: split.splice(1).join(' ')
        };
    }

    handleInput(msg) {
        if(!this.hasCommand(msg)) return false;

        const commandParts = this.parseCommand(msg);
        if(!commandParts) return false;

        this.dispatch(commandParts.name, commandParts.args);
        return true;
    }
}
