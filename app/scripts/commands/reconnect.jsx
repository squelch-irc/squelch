module.exports =  (args, { client }) => {

    if(client.isConnected()) return;

    client.connect();
};
