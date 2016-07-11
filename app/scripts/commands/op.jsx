module.exports =  (args, { target, client }) => {
    if(!client.isChannel(target)) {
        return client.info('/op can only be used in a channel');
    }

    if(!args) return client.info('Usage: /op [nick...]');

    client.op(target, args.split(/\s+/));
};

module.exports.help = 'Sets op status on one or more users in the channel.';
module.exports.usage = '[nick...]';
