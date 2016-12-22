const immutably = require('object-path-immutable')

// TODO: remove this when https://github.com/yoshuawuyts/wayfarer/pull/51 is merged
module.exports = view => (state, ...args) => {
  const { channel, user } = state.location.params
  state = immutably.assign(state, 'location.params', {
    channel: channel ? decodeURIComponent(channel) : channel,
    user: user ? decodeURIComponent(user) : user
  })

  return view(state, ...args)
}
