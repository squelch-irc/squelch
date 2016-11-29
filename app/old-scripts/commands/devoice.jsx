module.exports = (args, { target, client }) => {
  if (!client.isChannel(target)) {
    return client.info('/devoice can only be used in a channel')
  }

  if (!args) return client.info('Usage: /devoice [nick...]')

  client.devoice(target, args.split(/\s+/))
}

module.exports.help = 'Removes voice status from one or more users in the channel.'
module.exports.usage = '[nick...]'
