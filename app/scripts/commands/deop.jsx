const parse = require('string-args');

module.exports =  (args, { target, client }) => {
    if(!client.isChannel(target)) {
        return client.info('/deop can only be used in a channel');
    }

    if(!args) return client.info('Usage: /deop [nick...]');

    client.deop(target, args.split(/\s+/));
};
