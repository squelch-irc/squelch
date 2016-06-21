const parse = require('string-args');

module.exports =  (args, { target, client }) => {
    if(!client.isChannel(target)) {
        return client.info('/op can only be used in a channel');
    }

    if(!args) return client.info('Usage: /op [nick...]');

    client.op(target, args.split(/\s+/));
};
