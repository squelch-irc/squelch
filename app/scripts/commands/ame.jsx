module.exports =  (args, { client }) => {
    if(!args) {
        return client.info('Usage: /ame [message]');
    }

    client.getJoinedChannels().map(chan => client.action(chan, args));
};

module.exports.help = 'Sends a /me message to all channels in the server.';
module.exports.usage = '[message]';
