const parse = require('string-args')

module.exports = (args, { target, client, commandName }) => {
  args = parse('nick', args)

  if (!args.nick) {
    return client.info(`Usage: /${commandName} [nick]`)
  }

  client.ban(target, args.nick)
}

module.exports.help = 'Bans a user from the channel.'
module.exports.usage = '[nick]'
