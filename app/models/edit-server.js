const immutably = require('object-path-immutable')
const username = require('username').sync()
const checkit = require('checkit')
const _ = require('lodash')
// TODO: don't use sync username call

const addLabel = label => rule => ({ rule, label })

const validate = (config, state) => {
  const [err, valid] = checkit({
    name: ['required', 'string', (name, params, state) => {
      const names = _(state.config).keys()
      .filter(name => name === state.editServer.originalName)
      .value()

      if (names.includes(name)) throw new Error('This server name already exists')
    }].map(addLabel('server name')),
    server: ['required', 'string'].map(addLabel('hostname')),
    port: ['required', 'integer', port => {
      if (port < 0 || port > 65535) throw new Error('The port must be in the range 0-66535')
    }],
    ssl: ['required', 'boolean'],
    username: 'string',
    password: 'string',
    realname: 'string',
    nick: ['required', 'string', 'minLength:1', nick => {
      if (nick.match(/^\d/)) throw new Error(`The nickname can't start with a digit`)
      if (nick[0] === '-') throw new Error(`The nickname can't start with a hyphen`)
      if (nick.match(/\s/)) throw new Error(`The nickname can't have spaces`)
      var invalidChar = nick.match(/(^[^a-z_\-[\]\\^{}|`]|[^a-z0-9_\-[\]\\^{}|`])/i)
      if (invalidChar) {
        throw new Error(`The nickname can't have this character: ${invalidChar[0]}`)
      }
    }].map(addLabel('nickname'))
  })
  .validateSync(config, state)
  return { err, valid }
}

module.exports = {
  state: {
    editServer: {
      originalName: null,
      showAdvanced: false,
      config: {
        name: '',
        server: '',
        port: 6667,
        ssl: false,
        nick: username,
        channels: [],
        password: '',
        username: username,
        realname: username
      },
      validation: {
        err: null,
        valid: false
      }
    }
  },
  effects: {
    editServer_save: (state, data, send) => {
      const { validation, originalName, config } = state.editServer
      if (!validation.valid) throw new Error('Cannot save invalid server')

      if (originalName != null) {
        // TODO: edit existing server
      } else {
        return send('config:addServer', { server: config })
      }
    }
  },
  reducers: {
    editServer_reset: (state, data) => {
      return module.exports.state
    },
    editServer_setConfig: (state, data) => {
      state = immutably.assign(state, 'editServer.config', data)
      state.editServer.validation = validate(state.editServer.config, state)
      return state
    },
    editServer_toggleAdvanced: (state) => {
      return immutably.set(state, 'editServer.showAdvanced', !state.editServer.showAdvanced)
    }
  }
}
