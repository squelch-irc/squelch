module.exports =  (args, { target, client }) => {
    if(!target) {
        return client.info('Who you gonna slap if you ain\'t in a channel?');
    }
    if(!args) {
        return client.info('Usage: /slap [nick]');
    }
    client.action(target, `slaps ${args} around a bit with a large trout`);
};
