import parse from 'string-args';

export default (args, e) => {
    args = parse('target msg...', args);
    if(!args.target || !args.msg) {
        return e.client.info('Usage: /msg [target] [message]');
    }
    e.client.msg(args.target, args.msg);
};
