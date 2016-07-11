module.exports =  (args, { client }) => {
    if(!args) {
        return client.info('Usage: /amsg [message]');
    }

    client.getJoinedChannels().map(chan => client.msg(chan, args));
};

module.exports.help = 'Sends a message to all channels in the server.';
module.exports.usage = '[message]';
