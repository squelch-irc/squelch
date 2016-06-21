module.exports =  (args, { client, server }) => {
    client.clear();
    client.channels().forEach(chan => client.clear(chan));
    Object.keys(server.userMessages).forEach(user => client.clear(user));
};
