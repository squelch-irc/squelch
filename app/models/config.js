const immutably = require('object-path-immutable')
const Config = require('electron-config')
const _ = require('lodash')

const config = new Config({
  name: 'squelch',
  defaults: {
    servers: {}
  }
})

module.exports = {
  namespace: 'config',
  state: {},
  effects: {
    save: state => {
      // TODO: use a config lib that can save async
      config.store = state
    },
    addServer: (state, { server }, send) => {
      return send('config:set', {
        path: 'servers',
        value: immutably.set(state.servers, server.name, server)
      })
      .then(() => send('config:save'))
    }
    // TODO: editServer effect
  },
  reducers: {
    load: (state, config) => {
      return config
    },
    set: (state, { path, value }) => {
      return immutably.set(state, path, value)
    }
  },
  subscriptions: [
    send => {
      // TODO: use a config lib that can load async
      const loadedConfig = config.store
      return send('config:load', loadedConfig)
      .then(() => Promise.all(
        _.map(loadedConfig.servers, server => send('addServer', {
          config: server
        }))
      ))
    }
  ]
}
