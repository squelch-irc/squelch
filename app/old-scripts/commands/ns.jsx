module.exports = (args, { client }) => {
  client.msg('NickServ', args)
}

module.exports.help = 'Alias for /msg NickServ'
module.exports.usage = '[message...]'
