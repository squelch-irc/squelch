const immutably = require('object-path-immutable')
const _ = require('lodash')
const { getCurrentServerId, getCurrentChannel, getCurrentPrivMsg } = require('./util')

// Returns a route function for MESSAGE_ROUTES to a single target
// specified by a prop in the message. ("Target" is channel or user)
// If toProp is our own nick, route to fromProp instead
const toTargetProp = (toProp, fromProp) => (message, server) => {
  if (message[toProp] === server.client.nick()) {
    return { server: false, targets: [message[fromProp]] }
  }

  return { server: false, targets: [message[toProp]] }
}

// A route function that routes to the server log only
const toServer = () => ({ server: true, targets: [] })

// A route function that routes to current view (if possible) and server log
// Also routes to user view if message.from exists
const toCurrentAndServer = (message) => ({
  server: true,
  current: true,
  targets: (message.from) ? [message.from] : []
})

// A route function that routes to all logs
const toAll = () => ({ all: true })

// A route function that routes nowhere
const ignore = () => ({})

// Functions that return where a message type should be sent to
// Should return {all: boolean, server: boolean, targets: [], message: {}}
// If all is true, will route to all open logs, otherwise
// If server is true, will route to server view
// If current is true, will route to current view if possible
// If targets has strings, will route to those targets (channel or user)
// If message is specified, it will replace the original message.
const MESSAGE_ROUTES = {
  info: toCurrentAndServer,
  msg: toTargetProp('to', 'from'),
  action: toTargetProp('to', 'from'),
  notice: (message, server) => {
    if (message.to === server.client.nick()) {
      return toCurrentAndServer(message, server)
    }
        // Send notices like pre-connection notices only to server
    return { server: true }
  },
  invite: toCurrentAndServer,
  join: toTargetProp('chan'),
  part: toTargetProp('chan'),
  kick: toTargetProp('chan'),
  topic: toTargetProp('chan'),
  topicwho: toTargetProp('chan'),
  mode: toTargetProp('chan'),
  usermode: toServer,
  motd: toServer,
  nick: (message, server) => {
    if (message.me) {
      return { all: true }
    }

    let targets = _(server.channels)
        .keys()
        .filter((chan) => {
          return server.channels[chan].users[message.newNick] != null
        })
        .value()

    if (server.userMessages[message.newNick]) {
      targets = targets.concat(message.newNick)
    }

    return {
      server: false,
      targets
    }
  },
  connecting: message => ({
    server: true,
    message: { type: 'info', msg: `Connecting to ${message.server} on port ${message.port}...` }
  }),
  'connection-established': message => ({
    server: true,
    message: { type: 'info', msg: `Connection to host at ${message.server} established` }
  }),
  connect: () => ({
    server: true,
    message: { type: 'info', msg: 'Connected' }
  }),
  reconnecting: message => ({
    server: true,
    message: { type: 'info', msg: `Reconnecting in ${message.delay / 1000} seconds (${message.triesLeft} tries remaining)...` }
  }),
  disconnect: message => ({
    all: true,
    message: { type: 'info', msg: `Disconnected (${message.reason})` }
  }),
  quit: (message, server) => {
    let targets = message.channels
        // Route to user if user window is open
    if (server.userMessages[message.nick]) {
      targets = targets.concat(message.nick)
    }
    return { targets }
  },
  error: toAll
}

const RAW_MESSAGE_ROUTES = {
  324: (message) => {
    return { targets: [message.params[1]], server: true }
  },
  '400-599': toCurrentAndServer,
  331: ignore,
  332: ignore,
  333: ignore,
  353: ignore,
  366: ignore,
  372: ignore,
  375: ignore,
  376: ignore,
  PING: ignore,
  PONG: ignore,
  PRIVMSG: ignore,
  NOTICE: ignore,
  JOIN: ignore,
  PART: ignore,
  KICK: ignore,
  MODE: ignore,
  NAMES: ignore,
  NICK: ignore,
  INVITE: ignore,
  ERROR: ignore,
  QUIT: ignore
}

const getKeyRange = _.partial(require('get-key-range'), RAW_MESSAGE_ROUTES)

// This function takes a number and returns value in above RAW_MESSAGE_ROUTES
// that satisfies a key's range. Memoized because this runs often w/ same result
const getRawRoute = _.memoize((cmd) => RAW_MESSAGE_ROUTES[cmd] || getKeyRange(cmd))

const MESSAGE_LIMIT = 500

const batchAppendServer = (server, batch, serverId, msg) => {
  batch = batch.push(['servers', serverId, 'messages'], msg)
  if (server.messages.length + 1 > MESSAGE_LIMIT) {
    batch = batch.del(['servers', serverId, 'messages.0'])
  }
  return batch
}

const batchAppendChannel = (server, batch, serverId, chan, msg) => {
  batch = batch.push(['servers', serverId, 'channels', chan, 'messages'], msg)
  if (server.channels[chan].messages.length + 1 > MESSAGE_LIMIT) {
    batch = batch.del(['servers', serverId, 'channels', chan, 'messages.0'])
  }
  return batch
}

const batchAppendPrivMsg = (server, batch, serverId, user, msg) => {
  if (!server.userMessages[user]) {
    batch = batch.set(['servers', serverId, 'userMessages', user], [])
  }
  batch = batch.push(['servers', serverId, 'userMessages', user], msg)
  if (server.userMessages[user] && server.userMessages[user].length + 1 > MESSAGE_LIMIT) {
    batch = batch.del(['servers', serverId, 'userMessages', user, '0'])
  }
  return batch
}

// Send message to correct log in the state
module.exports = (state, message) => {
  const serverId = message.id
  const server = state.servers[serverId]

  let route
  if (MESSAGE_ROUTES[message.type]) {
    // Match message against a message type
    route = MESSAGE_ROUTES[message.type](message, server)
  } else if (message.type === 'raw' && getRawRoute(message.command)) {
    // Match message against a specific raw command number
    route = getRawRoute(message.command)(message, server)
  }

  let batch = immutably(state)

  // If we have a route defined for this type, send to the specified logs
  if (route) {
    if (route.message) {
      route.message.id = message.id
      route.message.messageId = message.messageId
      route.message.timestamp = message.timestamp
    }

    message = route.message || message

    if (route.all) {
      // Route to all: server, all channels, all open users
      batch = batchAppendServer(server, batch, serverId, message)
      _.each(server.channels, chan => {
        batch = batchAppendChannel(server, batch, serverId, chan.name, message)
      })
      _.each(server.userMessages, (log, user) => {
        batch = batch.push(['servers', serverId, 'userMessages', user], message)
      })
    } else {
      // Route to current if it's the same server
      if (route.current && server.id === getCurrentServerId(state)) {
        if (getCurrentChannel(state)) {
          batch = batchAppendChannel(server, batch, serverId, getCurrentChannel(state), message)
        }
        if (getCurrentPrivMsg(state)) {
          batch = batchAppendPrivMsg(server, batch, serverId, getCurrentPrivMsg(state), message)
        }
      }

      // Route to server messages
      if (route.server) {
        batch = batchAppendServer(server, batch, serverId, message)
      }

      // Route to specified targets
      _.each(route.targets, target => {
        if (server.client.isChannel(target)) {
          // Target is a channel, route to channel log
          batch = batchAppendChannel(server, batch, serverId, target, message)
        } else {
          // Target is a user, route to user log
          batch = batchAppendPrivMsg(server, batch, serverId, target, message)
        }
      })
    }
  } else if (message.type === 'raw') {
    batch = batchAppendServer(server, batch, serverId, message)
  }

  return batch.value()
}
