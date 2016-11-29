module.exports = (args, { client }) => {
  if (args) client.info(args)
}

module.exports.help = 'Shows a message in the current window. This doesn\'t send anything to the server.'
module.exports.usage = '[message...]'
