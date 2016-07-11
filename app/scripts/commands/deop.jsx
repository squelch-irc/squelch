module.exports =  (args, { target, client }) => {
    if(!client.isChannel(target)) {
        return client.info('/deop can only be used in a channel');
    }

    if(!args) return client.info('Usage: /deop [nick...]');

    client.deop(target, args.split(/\s+/));
};

module.exports.help = 'Removes op status from one or more users in the channel.';
module.exports.usage = '[nick...]';
