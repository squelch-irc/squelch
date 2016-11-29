const immutably = require('object-path-immutable')

module.exports = {
  state: {
    config: {
      servers: []
    }
  },
  reducers: {
    addServer: ({ server }, state) => {
      return immutably.push(state, 'config.servers', server)
    }
  }
}
