
// all plugins are passed a wrapper for State

const shrug = () => {
    return {
        run: (irc, args) => `${args || ''} ¯\\_(ツ)_/¯`.trim()
    };
};

const test = () => {
    return {
        run: () => 'this is a test'
    };
};

const chanopts = () => {
    return {
        channelMenu: (channel) => {
            return [
                {
                    label: 'Options',
                    click: () => console.log('options '+channel)
                }
            ];
        }
    };
};

const voice = () => {
    return {
        userMenu: (user) => {
            return [
                {
                    label: `Voice ${user.nick}`,
                    click: () => console.log('voice '+user)
                }
            ];
        },
        run: (irc, argString) => {
            const args = argString.split(' ');
            const chan = args.length > 1 ? args[0] : irc.to;
            const user = args.length > 1 ? args[1] : args[0];

            // /voice User
            // /voice #channel User
            irc.server.getClient().voice(irc.fixChannelName(chan), user);
        }
    };
};

module.exports = { shrug, test, chanopts, voice };
