const parse = require('string-args');

module.exports =  (args, { target, client, commandName }) => {

    args = parse('nick', args);

    if(!args.nick) {
        return client.info(`Usage: /${commandName} [nick]`);
    }

    client.unban(target, args.nick);

};

module.exports.help = 'Unbans a user from the channel.';
module.exports.usage = '[nick]';
