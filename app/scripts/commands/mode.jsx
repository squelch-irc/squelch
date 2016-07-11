const parse = require('string-args');

module.exports =  (args, { target, client }) => {
    const { chan, mode, modeArgs } = parse('chan mode modeArgs...', args);

    if(!chan && client.isChannel(target)) {
        return client.raw('MODE ' + target);
    }

    else if(!chan) {
        return client.info('Usage: /mode [channel] {mode} {args...}');
    }

    else if(!mode) {
        return client.raw('MODE ' + chan);
    }

    client.mode(chan, mode, modeArgs);
};

module.exports.help = 'Sets the mode for a channel. If the mode is omitted, then the current mode will be shown.';
module.exports.usage = '[channel] {mode} {args...}';
