const parse = require('string-args')

module.exports = (args, { target, client, commandName }) => {
  args = parse('target key', args)

  if (!args.target && client.isChannel(target)) {
    args.target = target
  }

  if (!args.target) {
    return client.info(`Usage: /${commandName} [channel] {key}`)
  }

  client.join(args.target, args.key)
}

module.exports.help = 'Joins a channel. A channel key may optionally be provided'
module.exports.usage = '[channel] {key}'
