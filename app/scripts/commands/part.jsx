const parse = require('string-args');

module.exports =  (args, { target, client, commandName }) => {
    args = parse('target reason...', args);

    if(!(args.target || target)) {
        return client.info(`Usage: /${commandName} [channel] {reason}`);
    }

    client.close(args.target || target, args.reason);
};
