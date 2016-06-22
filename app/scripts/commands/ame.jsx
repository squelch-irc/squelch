module.exports =  (args, { client }) => {
    if(!args) {
        return client.info('Usage: /ame [message]');
    }

    client.getJoinedChannels().map(chan => client.action(chan, args));
};
