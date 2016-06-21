module.exports =  (args, { client }) => {
    if(!args) {
        return client.info('Usage: /amsg [message]');
    }

    client.channels().map(chan => client.msg(chan, args));
};
