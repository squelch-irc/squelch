const parse = require('string-args')

module.exports = (args, { target, client }) => {
  const { chan, topic } = parse('chan topic...', args)

  if (!chan && !client.isChannel(target)) {
    return client.info('Usage: /topic [channel] {topic...}')
  }

  if (!chan) {
    return client.raw('TOPIC ' + target)
  }

  if (!topic) {
    return client.raw('TOPIC ' + chan)
  }

  client.topic(chan, topic)
}

module.exports.help = 'Sets or displays the topic for a channel.'
module.exports.usage = '[channel] {topic...}'
