module.exports = (args, { client }) => {
  if (client.isConnected()) return client.disconnect(args)

  else if (client.isConnecting()) return client.forceQuit(args)

  return client.info('You are not connected to this server')
}

module.exports.help = 'Disconnects from the current server.'
module.exports.usage = '{reason}'
