// TODO: get unit test coverage and make sure this covers everything
const test = require('ava')
const _ = require('lodash')
const deepFreeze = require('deep-freeze-node')
const immutably = require('object-path-immutable')
const MessageRouter = require('../app/models/messageRouter')

// Generate a fake message object
const fakeMsg = (from, to, msg, id = 'server1') => {
    // If first param is object, set up boilerplate properties
  if (_.isObject(from)) {
    from.id = id
    from.messageId = _.uniqueId()
    from.timestamp = new Date()
    return from
  }

    // Else make a 'msg' message
  return {
    id,
    msg,
    to,
    from,
    messageId: _.uniqueId(),
    type: 'msg',
    timestamp: new Date()
  }
}

// Tests if one server state was modified
const testModified = (t, newState, serverId) => t.not(
  t.context.state.servers[serverId],
  newState.servers[serverId],
  `Server ${serverId} should be modified`
)

// Tests if one server state was not modified
const testNotModified = (t, newState, serverId) => t.is(
  t.context.state.servers[serverId],
  newState.servers[serverId],
  `Server ${serverId} should be unmodified`
)

const testMessageInServer = (t, newState, message, serverId = 'server1') => {
  const oldLog = t.context.state.servers[serverId].messages
  const log = newState.servers[serverId].messages

  t.is(log.length, oldLog.length + 1)
  t.deepEqual(log[log.length - 1], message)
}

const testMessageInChannel = (t, newState, message, channel, serverId = 'server1') => {
  const oldLog = t.context.state.servers[serverId].channels[channel].messages
  const log = newState.servers[serverId].channels[channel].messages

  t.is(log.length, oldLog.length + 1)
  t.deepEqual(log[log.length - 1], message)
}

const testMessageInUser = (t, newState, message, user, serverId = 'server1') => {
  const oldLog = t.context.state.servers[serverId].userMessages[user]
  const log = newState.servers[serverId].userMessages[user]

  t.is(log.length, (oldLog || []).length + 1)
  t.deepEqual(log[log.length - 1], message)
}

const testMessageInAll = (t, newState, message, serverId = 'server1') => {
  testMessageInServer(t, newState, message, serverId)

  const server = t.context.state.servers[serverId]

  _(server.userMessages)
    .keys()
    .each(user => testMessageInUser(t, newState, message, user, serverId))

  _(server.channels)
    .keys()
    .each(chan => testMessageInChannel(t, newState, message, chan, serverId))
}

test.beforeEach(t => {
    // Create a mock client getter that implements enough methods
    // to work with the message router
  const createGetClient = id => ({
    nick: () => 'PakaluPapito',
    isInChannel: (ch, user = 'PakaluPapito') => {
      const users = t.context.state.get().servers[id].channels[ch].users
      return users[user] !== null && users[user] !== undefined
    },
    isChannel: (ch) => ch[0] === '#'
  })

  t.context.state = deepFreeze({
    location: {
      params: {
        serverId: 'server1',
        channel: '#kellyirc',
        user: undefined
      }
    },
    servers: {
      server1: {
        id: 'server1',
        messages: [],
        userMessages: {
          Camel: [fakeMsg('Camel', 'PakaluPapito', 'im ur camel')],
          seiyria: [fakeMsg('seiyria', 'PakaluPapito', 'm8')]
        },
        channels: {
          '#kellyirc': {
            name: '#kellyirc',
            messages: [],
            users: { seiyria: '', KR: '', SpookyCo: '', PakaluPapito: '' }
          },
          '#furry': {
            name: '#furry',
            messages: [
              fakeMsg('FurryBoy23', '#furry', 'Love too be furry'),
              fakeMsg('Furrygirl23', '#furry', 'Same')
            ],
            users: { seiyria: '', KR: '', PakaluPapito: '' }
          },
          '#empty': {
            name: '#empty',
            messages: [],
            users: { PakaluPapito: '' }
          }
        },
        connected: true,
        client: createGetClient('server1')
      },
      server2: {
        id: 'server2',
        messages: [],
        userMessages: {
          B0T: _.times(500,
                        fakeMsg.bind(null, 'B0T', 'PakaluPapito', 'sexy singles in ur area')
                    )
        },
        channels: {
        },
        connected: true,
        client: createGetClient('server2')
      }
    }
  }, { live: false })
})

test('msg', t => {
  const message = fakeMsg({
    type: 'msg',
    from: 'KR',
    to: '#kellyirc',
    msg: 'hello'
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInChannel(t, newState, message, '#kellyirc')
})

test('action', t => {
  const message = fakeMsg({
    type: 'action',
    from: 'seiyria',
    to: '#kellyirc',
    msg: 'slaps PakaluPapito silly with a god damn fish'
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInChannel(t, newState, message, '#kellyirc')
})

test('notice', t => {
  const message = fakeMsg({
    type: 'notice',
    from: 'Camel',
    to: 'PakaluPapito',
    msg: 'feed me pls'
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInServer(t, newState, message)
  testMessageInUser(t, newState, message, 'Camel')
  testMessageInChannel(t, newState, message, '#kellyirc')
})

test('preconnection notice', t => {
  const message = fakeMsg({
    type: 'notice',
    from: 'server.ircnet.net',
    to: '*',
    msg: '*** No ident server found ***'
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInServer(t, newState, message)

    // Test other logs are unmodified
  t.is(
        newState.servers['server1'].channels,
        t.context.state.servers['server1'].channels
    )
  t.is(
        newState.servers['server1'].userMessages,
        t.context.state.servers['server1'].userMessages
    )
})

test('invite', t => {
  const message = fakeMsg({
    type: 'invite',
    from: 'Camel',
    chan: '#water'
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInServer(t, newState, message)
  testMessageInUser(t, newState, message, 'Camel')
  testMessageInChannel(t, newState, message, '#kellyirc')
})

test('join', t => {
  const message = fakeMsg({
    type: 'join',
    nick: 'SpookyCo',
    chan: '#furry',
    me: false
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInChannel(t, newState, message, '#furry')
})

test('part', t => {
  const message = fakeMsg({
    type: 'part',
    nick: 'SpookyCo',
    chan: '#kellyirc',
    reason: '',
    me: false
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInChannel(t, newState, message, '#kellyirc')
})

test('kick', t => {
  const message = fakeMsg({
    type: 'kick',
    nick: 'SpookyCo',
    kicker: 'KR',
    chan: '#kellyirc',
    reason: '',
    me: false
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInChannel(t, newState, message, '#kellyirc')
})

test('topic', t => {
  const message = fakeMsg({
    type: 'topic',
    chan: '#kellyirc',
    topic: 'The problems are bad, but the causes, the causes are very good'
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInChannel(t, newState, message, '#kellyirc')
})

test('topicwho', t => {
  const message = fakeMsg({
    type: 'topicwho',
    chan: '#kellyirc',
    hostmask: 'KR!~KR@78-72-225-13-no193.business.telia.com',
    time: new Date()
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInChannel(t, newState, message, '#kellyirc')
})

test('mode', t => {
  const message = fakeMsg({
    type: 'mode',
    chan: '#kellyirc',
    sender: 'KR',
    mode: '-o+o KR SpookyCo'
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInChannel(t, newState, message, '#kellyirc')
})

test('usermode', t => {
  const message = fakeMsg({
    type: 'usermode',
    user: 'PakaluPapito',
    sender: 'CoolIRCOp',
    mode: '+o'
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInServer(t, newState, message)
})

test('nick (self)', t => {
  const message = fakeMsg({
    type: 'nick',
    oldNick: 'PakaluPapito',
    newNick: 'PakaluPapito|oh|hell|yea',
    me: true
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInAll(t, newState, message)
})

test('nick (other)', t => {
  const message = fakeMsg({
    type: 'nick',
    oldNick: 'notSeiyria',
    newNick: 'seiyria',
    me: false
  })

  // NOTE: the server reaction will have updated the nicks and moved the
  // userMessages array by now, so the state already uses newNick
  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')

  testMessageInChannel(t, newState, message, '#kellyirc')
  testMessageInChannel(t, newState, message, '#furry')
  t.is(newState.servers.server1.channels['#empty'].messages.length, 0,
        'The message should not have gone to #empty (seiyria not in that channel)')
  testMessageInUser(t, newState, message, 'seiyria')
  t.not(newState.servers.server1.userMessages.notSeiyria,
        'The userMessages under the old nick should not be used')
})

test('connecting', t => {
  const message = fakeMsg({
    type: 'connecting',
    server: 'irc.ircnet.net',
    port: 6667
  })

  const newState = MessageRouter(t.context.state, message)

  const infoMsg = {
    type: 'info',
    id: message.id,
    messageId: message.messageId,
    timestamp: message.timestamp,
    msg: `Connecting to ${message.server} on port ${message.port}...`
  }

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInServer(t, newState, infoMsg)
})

test('connection-established', t => {
  const message = fakeMsg({
    type: 'connection-established',
    server: 'irc.ircnet.net',
    port: 6667
  })

  const newState = MessageRouter(t.context.state, message)

  const infoMsg = {
    type: 'info',
    id: message.id,
    messageId: message.messageId,
    timestamp: message.timestamp,
    msg: `Connection to host at ${message.server} established`
  }

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInServer(t, newState, infoMsg)
})

test('reconnecting', t => {
  const message = fakeMsg({
    type: 'reconnecting',
    server: 'irc.ircnet.net',
    port: 6667,
    delay: 5000,
    triesLeft: 2
  })

  const newState = MessageRouter(t.context.state, message)

  const infoMsg = {
    type: 'info',
    id: message.id,
    messageId: message.messageId,
    timestamp: message.timestamp,
    msg: `Reconnecting in ${message.delay / 1000} seconds (${message.triesLeft} tries remaining)...`
  }

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInServer(t, newState, infoMsg)
})

test('connect', t => {
  const message = fakeMsg({
    type: 'connect',
    server: 'irc.ircnet.net',
    port: 6667,
    nick: 'PakaluPapito'
  })

  const newState = MessageRouter(t.context.state, message)

  const infoMsg = {
    type: 'info',
    id: message.id,
    messageId: message.messageId,
    timestamp: message.timestamp,
    msg: 'Connected'
  }

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInServer(t, newState, infoMsg)
})

test('disconnect', t => {
  const message = fakeMsg({
    type: 'disconnect',
    reason: 'Force Quit'
  })

  const newState = MessageRouter(t.context.state, message)

  const infoMsg = {
    type: 'info',
    id: message.id,
    messageId: message.messageId,
    timestamp: message.timestamp,
    msg: 'Disconnected (Force Quit)'
  }

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInServer(t, newState, infoMsg)
})

test('quit', t => {
  const message = fakeMsg({
    type: 'quit',
    nick: 'seiyria',
    reason: 'peace out doggs',
    channels: ['#kellyirc', '#furry']
  })
  t.context.state = immutably.del(t.context.state, 'servers.server1.channels.#kellyirc.seiyria')
  t.context.state = immutably.del(t.context.state, 'servers.server1.channels.#furry.seiyria')

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInChannel(t, newState, message, '#kellyirc')
  testMessageInChannel(t, newState, message, '#furry')
  testMessageInUser(t, newState, message, 'seiyria')
  t.is(newState.servers.server1.channels['#empty'].messages.length, 0,
        'The message should not have gone to #empty (seiyria not in that channel)')
})

test('error', t => {
  const message = fakeMsg({
    type: 'error',
    command: 'ERROR',
    params: ['Connection Timed Out']
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInAll(t, newState, message)
})

test('msg (private message)', t => {
  const message = fakeMsg({
    type: 'msg',
    from: 'KR',
    to: 'PakaluPapito',
    msg: 'hello'
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInUser(t, newState, message, 'KR')
})

test('action (private message)', t => {
  const message = fakeMsg({
    type: 'action',
    from: 'seiyria',
    to: 'PakaluPapito',
    msg: 'slaps PakaluPapito silly with a god damn fish'
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInUser(t, newState, message, 'seiyria')
})

test('raw', t => {
  const message = fakeMsg({
    type: 'raw',
    command: 251,
    params: ['There are 11 users and 283 invisible on 23 servers']
        // Other data omitted for brevity
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInServer(t, newState, message)
})

test('raw (ignored)', t => {
  const message = fakeMsg({
    type: 'raw',
    command: 'JOIN',
    params: ['#empty']
        // Other data omitted for brevity
  })

  const newState = MessageRouter(t.context.state, message)

  testNotModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
})

test('raw 324', t => {
  const message = fakeMsg({
    type: 'raw',
    command: '324',
    params: ['SquelchUser', '#empty', '+npt']
        // Other data omitted for brevity
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInChannel(t, newState, message, '#empty')
  testMessageInServer(t, newState, message)
})

test('raw 400-599', t => {
  const message = fakeMsg({
    type: 'raw',
    command: '403',
    params: ['SquelchUser', '#notexists', 'No such channel']
        // Other data omitted for brevity
  })

  const newState = MessageRouter(t.context.state, message)

  testModified(t, newState, 'server1')
  testNotModified(t, newState, 'server2')
  testMessageInChannel(t, newState, message, '#kellyirc')
  testMessageInServer(t, newState, message)
})

test('log overflow', t => {
  const message = fakeMsg('B0T', 'PakaluPapito', 'u there?', 'server2')

  const newState = MessageRouter(t.context.state, message)

  testNotModified(t, newState, 'server1')
  testModified(t, newState, 'server2')

  const log = newState.servers.server2.userMessages.B0T

  t.is(log.length, 500)
  t.deepEqual(log[log.length - 1], message)
})
