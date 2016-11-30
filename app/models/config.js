const immutably = require('object-path-immutable')
const Config = require('electron-config')

const config = new Config({
  name: 'squelch',
  defaults: {
    servers: []
  }
})

module.exports = {
  namespace: 'config',
  state: config.store,
  effects: {
    save: state => {
      // TODO: use a config lib that can save async
      config.store = state
    },
    addServer: (state, { server }, send) => {
      return send('config:set', {
        path: 'servers',
        value: state.servers.concat(server)
      })
      .then(() => send('config:save'))
    }
  },
  reducers: {
    set: (state, { path, value }) => {
      return immutably.set(state, path, value)
    }
  }
}
