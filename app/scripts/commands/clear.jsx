module.exports =  (args, { target, client }) => {
    client.clear(args || target || undefined);
};
