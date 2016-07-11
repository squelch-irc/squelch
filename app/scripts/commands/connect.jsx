const parse = require('string-args');

module.exports = (Squelch) => {
    const connect = (args, { client }) => {


        args = parse('server port', args);

        if(!args.server) {
            if(client.isConnected() || client.isConnecting()) return;
            return client.connect();
        }

        // TODO: Try to match a server in the config first.
        //       Failing that, also have a config to set the
        //       nickname to something other than SquelchUser.
        const [host, port] = args.server.split(':');

        const config = {
            server: host,
            ssl: false
        };

        args.port = port || args.port;

        if(args.port && args.port.slice(0,1) === '+') {
            args.port = args.port.slice(1);
            config.ssl = true;
        }

        if(args.port) config.port = args.port;

        Squelch.addServer(config);

    };

    connect.help = 'Connects to a server. If a server isn\'t provided, it will attempt to reconnect to the current server. You may connect via SSL if you put a + before the port (ex: +6697).';
    connect.usage = [
        '{server:port}',
        '{server} {port}'
    ];

    return connect;
};
