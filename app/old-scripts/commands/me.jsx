module.exports = (args, { client, target }) => client.action(target, args)

module.exports.help = 'Sends an action message.'
module.exports.usage = '[message...]'
