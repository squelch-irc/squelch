
// all plugins are passed a wrapper for State

import _ from 'lodash';

export const shrug = () => {
    return {
        run: (irc, args) => `${args || ''} ¯\\_(ツ)_/¯`.trim()
    };
};

export const test = () => {
    return {
        run: () => 'this is a test'
    };
};

export const voice = () => {
    return {
        run: (irc, argString) => {
            const args = argString.split(' ');
            const voice = irc.server.getClient().voice;
            const chan = args.length > 1 ? args[0] : irc.to;
            const user = args.length > 1 ? args[1] : args[0];

            // /voice User
            // /voice #channel User
            voice(chan, user);
        }
    }
};
