module.exports = {
  getCurrentServerId: state => state.location.params.serverId,
  getCurrentChannel: state => state.location.params.channel,
  getCurrentPrivMsg: state => state.location.params.user,

  isActive: (state, serverId, channel, user) => {
    let active = state.location.params.serverId === String(serverId)
    if (channel) active = active && state.location.params.channel === channel
    if (user) active = active && state.location.params.user === user
    return active
  }
}
