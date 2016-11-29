module.exports = (args, { client }) => {
  if (client.isConnected() || client.isConnecting()) return

  client.connect()
}

module.exports.help = 'Reconnects to the server.'
