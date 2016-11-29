const parse = require('string-args')

module.exports = (args, { client }) => {
  args = parse('target msg...', args)
  if (!args.target || !args.msg) {
    return client.info('Usage: /msg [target] [message]')
  }
  client.msg(args.target, args.msg)
}

module.exports.help = 'Sends a message to a target.'
module.exports.usage = '[target] [message]'
