const parse = require('string-args')

module.exports = (args, { target, client, commandName }) => {
  args = parse('target reason...', args)

  if (!(args.target || target)) {
    return client.info(`Usage: /${commandName} [channel] {reason}`)
  }

  client.close(args.target || target, args.reason)
}

module.exports.help = 'Leaves a channel. An explicit channel and reason may be optionally provided'
module.exports.usage = '{channel} {reason}'
