const immutably = require('object-path-immutable')
const username = require('username').sync()
const Checkit = require('checkit')
// TODO: test this in electron so this actually works
// TODO: don't use sync call

const addLabel = label => rule => ({ rule, label })

const checkit = Checkit({
  name: ['required', 'string'].map(addLabel('server name')),
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

module.exports = {
  namespace: 'editServer',
  state: {
    index: null,
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
  },
  reducers: {
    reset: (state, data) => {
      return module.exports.state
    },
    setConfig: (state, data) => {
      state = immutably.assign(state, 'config', data)
      const [err, valid] = checkit.validateSync(state.config)
      state.validation = { err, valid }
      return state
    },
    toggleAdvanced: (state) => {
      return { showAdvanced: !state.showAdvanced }
    }
  }
}
