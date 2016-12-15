const immutably = require('object-path-immutable')

// TODO: find a way to avoid having to use this
module.exports = view => (state, ...args) => {
  const { channel, user } = state.location.params
  state = immutably.assign(state, 'location.params', {
    channel: channel ? decodeURIComponent(channel) : channel,
    user: user ? decodeURIComponent(user) : user
  })

  return view(state, ...args)
}
