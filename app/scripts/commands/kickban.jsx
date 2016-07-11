const parse = require('string-args');

module.exports =  (args, { target, client, commandName }) => {

    args = parse('nick reason...', args);

    if(!args.nick) {
        return client.info(`Usage: /${commandName} [nick] {reason}`);
    }

    if(!args.reason) {
        args.reason = '';
    }

    client.kick(target, args.nick, args.reason);
    client.ban(target, args.nick);

};

module.exports.help = 'Kicks and bans a user from the channel. An optional reason can be provided.';
module.exports.usage = '[nick] {reason}';
