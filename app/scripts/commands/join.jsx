const parse = require('string-args');

module.exports =  (args, { target, client, commandName }) => {
    args = parse('target key', args);

    if(!args.target && client.isChannel(target)) {
        args.target = target;
    }

    if(!args.target) {
        return client.info(`Usage: /${commandName} [channel] {key}`);
    }

    client.join(args.target, args.key);
};
