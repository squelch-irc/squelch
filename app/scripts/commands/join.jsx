const parse = require('string-args');

module.exports =  (args, e) => {
    args = parse('target key', args);

    if(!args.target && e.target && e.client.isChannel(e.target)) {
        args.target = e.target;
    }

    if(!args.target) {
        return e.client.info('Usage: /join [channel] {key}');
    }
    e.client.join(args.target, args.key);
};
