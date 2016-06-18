const parse = require('string-args');

module.exports =  (args, e) => {
    args = parse('target reason...', args);

    if(!args.target && e.client.isChannel(e.target)) {
        args.target = e.target;
    }

    if(!args.target) {
        return e.client.info('Usage: /part [channel] {reason}');
    }
    e.client.part(args.target, args.reason);
};
