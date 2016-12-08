module.exports = {
  state: {},
  effects: {
    gotoSelectServer: (state, data, send, done) => {
      return send('selectServer:reset', data)
      .then(() => send('location:set', '/select-server'))
    },
    gotoCreateServer: (state, { config, showAdvanced }, send, done) => {
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
    }
  }
}
