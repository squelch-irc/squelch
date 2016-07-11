module.exports =  (args, { client }) => {
    client.clear();
    client.getJoinedChannels().forEach(chan => client.clear(chan));
    client.getOpenUserWindows().forEach(user => client.clear(user));
};

module.exports.help = 'Clears all messages in every window.';
