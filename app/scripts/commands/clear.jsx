module.exports =  (args, { target, client }) => {
    client.clear(args || target || undefined);
};

module.exports.help = 'Clears all messages in this channel. If a channel isn\'t provided, the current one is cleared.';
module.exports.usage = '{channel}';
