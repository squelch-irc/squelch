const hash = require('string-hash')

const nickColorClasses = [
  'dark-red',
  'red',
  'light-red',
  'orange',
  'gold',
  'purple',
  'light-purple',
  'dark-pink',
  'dark-green',
  'green',
  'navy',
  'dark-blue',
  'blue',
  'light-blue'
]

module.exports = {
  getCurrentServerId: state => state.location.params.serverId,
  getCurrentChannel: state => state.location.params.channel,
  getCurrentPrivMsg: state => state.location.params.user,

  nickColor: nick => nickColorClasses[hash(nick) % nickColorClasses.length],

  isActive: (state, serverId, channel, user) => {
    let active = state.location.params.serverId === String(serverId)
    if (channel) active = active && state.location.params.channel === channel
    if (user) active = active && state.location.params.user === user
    return active
  }
}
