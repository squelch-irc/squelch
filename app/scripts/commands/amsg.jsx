module.exports =  (args, { client }) => {
    if(!args) {
        return client.info('Usage: /amsg [message]');
    }

    client.getJoinedChannels().map(chan => client.msg(chan, args));
};
