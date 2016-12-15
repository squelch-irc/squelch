module.exports = {
  state: {},
  effects: {
    gotoSelectServer: (state, data, send) => {
      return send('selectServer:reset', data)
      .then(() => send('location:set', '/select-server'))
    },
    gotoCreateServer: (state, { config, showAdvanced }, send) => {
      var actualConfig = {}
      if (config) {
        actualConfig.name = config.name
        actualConfig.server = config.hostname
        actualConfig.port = config.port
        actualConfig.ssl = config.ssl
      }
      return send('editServer_reset')
      .then(() => { if (showAdvanced) return send('editServer_toggleAdvanced') })
      .then(() => send('editServer_setConfig', actualConfig))
      .then(() => send('location:set', '/edit-server'))
    },
    gotoServer: (state, { serverId }, send) => {
      return send('location:set', `/server/${serverId}`)
    },
    gotoChannel: (state, { serverId, channel }, send) => {
      return send('location:set', `/server/${serverId}/channel/${encodeURIComponent(channel)}`)
    },
    gotoPrivMsg: (state, { serverId, user }, send) => {
      return send('location:set', `/server/${serverId}/user/${encodeURIComponent(user)}`)
    }
  }
}
