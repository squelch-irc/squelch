const immutably = require('object-path-immutable')
const Client = require('squelch-client')
const _ = require('lodash')

const messageRouter = require('./messageRouter')

// Options for squelch-client that are always the same
// ...they just gotta be that way
const HARDCODED_SERVER_OPTIONS = {
  verbose: true,
  verboseError: true,
  autoNickChange: true,
  autoSplitMessage: true,
  messageDelay: 0,
  stripColors: false,
  stripStyles: false,
  autoConnect: false,
  triggerEventsForOwnMessages: true
}

let onServerEvent

module.exports = {
  state: {
    servers: {}
  },
  effects: {
    addServer: (state, { config }, send) => {
      const serverConfig = Object.assign({}, config, HARDCODED_SERVER_OPTIONS)
      const client = new Client(serverConfig)

      client.oldEmit = client.emit
      client.emit = (event, data) => {
        onServerEvent(event, data)
        client.oldEmit(event, data)
      }

      return send('_addServer', { config: serverConfig, client })
      .then(() => {
        client.connect(Infinity)
        return send('gotoServer', { serverId: client.id })
      })
    },
    removeServer: (state, { id }, send) => {
      const server = state.servers[id]

      if (!server) throw new Error(`servers:removeServer: Could not find server with id "${id}"`)

      server.client.forceQuit()
      server.client.removeAllListeners()
      server.client.emit = server.client.oldEmit
    }
    // TODO: closeChannel effect
  },
  reducers: {
    _addServer: (state, { config, client }) => {
      return immutably.set(state, ['servers', client.id], {
        id: client.id,
        name: config.name,
        messages: [],
        userMessages: {},
        channels: {},
        connected: false,
        client
      })
    },
    serverEvent_connect: (state, { id }) => {
      return immutably.set(state, ['servers', id, 'connected'], true)
    },
    serverEvent_nick: (state, { id, oldNick, newNick }) => {
      const { channels, userMessages } = state.servers[id]

      _.each(channels, (channel, chanName) => {
        const user = channel.users[oldNick]
        state = immutably(state)
        .set(['servers', id, 'channels', chanName, 'users', newNick], user)
        .del(['servers', id, 'channels', chanName, 'users', oldNick])
        .value()
      })

      if (userMessages[oldNick]) {
        state = immutably(state)
        .set(['servers', id, 'userMessages', newNick], userMessages[oldNick])
        .del(['servers', id, 'userMessages', oldNick])
        .value()
      }

      return state
    },
    serverEvent_join: (state, { id, me, chan, nick }) => {
      if (me) {
        return immutably.set(state, ['servers', id, 'channels', chan], {
          name: chan,
          users: {},
          mode: [],
          messages: [],
          topic: '',
          joined: true
        })

        // TODO: focus on joined channel
      } else {
        return immutably.set(state, ['servers', id, 'channels', chan, 'users', nick], {
          status: ''
        })
      }
    },
    serverEvent_part: (state, { id, me, chan, nick }) => {
      if (me && state.servers[id].channels[chan]) {
        return immutably.assign(state, ['servers', id, 'channels', chan], {
          users: {},
          mode: [],
          topic: '',
          joined: false
        })
      } else {
        return immutably.del(state, ['servers', id, 'channels', chan, 'users', nick])
      }
    },
    serverEvent_kick: (state, { id, me, chan, nick }) => {
      if (me && state.servers[id].channels[chan]) {
        return immutably.assign(state, ['servers', id, 'channels', chan], {
          users: {},
          mode: [],
          topic: '',
          joined: false
        })
      } else {
        return immutably.del(state, ['servers', id, 'channels', chan, 'users', nick])
      }
    },
    serverEvent_names: (state, { id, chan, names }) => {
      return immutably.set(state, ['servers', id, 'channels', chan, 'users'], _.mapValues(names, status => {
        return { status }
      }))
    },
    serverEvent_topic: (state, { id, chan, topic }) => {
      return immutably.set(state, ['servers', id, 'channels', chan, 'topic'], topic)
    },
    serverEvent_quit: (state, { id, nick }) => {
      _.each(state.servers[id].channels, (channel, chanName) => {
        state = immutably.del(state, ['servers', id, 'channels', chanName, 'users', nick])
      })

      return state
    },
    'serverEvent_+mode': (state, { id, chan, mode, param }) => {
      const prefix = state.servers[id].client.modeToPrefix(mode)
      if (prefix) {
        return immutably.set(state, ['servers', id, 'channels', chan, 'users', param, 'status'], prefix)
      } else {
        return immutably.push(state, ['servers', id, 'channels', chan, 'mode'], mode)
      }
    },
    'serverEvent_-mode': (state, { id, chan, mode, param }) => {
      const prefix = state.servers[id].client.modeToPrefix(mode)
      if (prefix) {
        return immutably.set(state, ['servers', id, 'channels', chan, 'users', param, 'status'], '')
      } else {
        return immutably.set(
          state,
          ['servers', id, 'channels', chan, 'mode'],
          _.filter(state.servers[id].channels[chan].mode, mode)
        )
      }
    },
    serverEvent_disconnect: (state, { id }) => {
      _.each(state.servers[id].channels, (channel, chanName) => {
        state = immutably.assign(state, ['servers', id, 'channels', chanName], {
          users: {},
          mode: [],
          topic: '',
          joined: false
        })
      })
      return immutably.set(state, ['servers', id, 'connected'], false)
    },

    receiveMessage: (state, data) => {
      return messageRouter(state, data)
    }
  },
  subscriptions: [
    send => {
      var nextMessageId = 1
      onServerEvent = (event, data) => {
        data.messageId = nextMessageId++
        data.type = event
        data.timestamp = new Date()
        // Whitelist of events we want to send to reducers
        switch (event) {
          case 'connect':
          case 'nick':
          case 'join':
          case 'part':
          case 'kick':
          case 'names':
          case 'topic':
          case 'quit':
          case '+mode':
          case '-mode':
          case 'disconnect':
            send(`serverEvent_${event}`, data)
            send('receiveMessage', data)
        }

        // Workaround to tell choo's promise plugin that this subscription never ends
        return new Promise(() => {})
      }
    }
  ]
}
