const test = require('ava');
const Freezer = require('freezer-js');
const _ = require('lodash');

const MessageRouter = require('../app/scripts/core/messageRouter');

// Generate a fake message object
const fakeMsg = (from, to, msg) => {
    // If first param is object, set up boilerplate properties
    if(_.isObject(from)) {
        from.id = _.uniqueId();
        from.timestamp = new Date();
        return from;
    }

    // Else make a 'msg' message
    return {
        id: _.uniqueId(),
        msg,
        to,
        from,
        type: 'msg',
        timestamp: new Date()
    };
};

// Tests if one server state was modified
const testModified = (t, serverId) => {
    const { servers } = t.context.state.get();
    const oldServers = t.context.oldState.servers;

    t.not(servers[serverId], oldServers[serverId], `${serverId} should be modified`);
};

// Tests if one server state was not modified
const testNotModified = (t, serverId) => {
    const { servers } = t.context.state.get();
    const oldServers = t.context.oldState.servers;

    t.is(servers[serverId], oldServers[serverId], 'Server 1 should be unmodified');
};


const testMessageInServer = (t, message, serverId = 'server1') => {
    const log = t.context.state.get().servers[serverId].messages;
    const oldLog = t.context.oldState.servers[serverId].messages;

    t.is(log.length, oldLog.length + 1);
    t.deepEqual(log[log.length - 1], message);
};

const testMessageInChannel = (t, message, channel, serverId = 'server1') => {
    const log = t.context.state.get().servers[serverId].channels[channel].messages;
    const oldLog = t.context.oldState.servers[serverId].channels[channel].messages;

    t.is(log.length, oldLog.length + 1);
    t.deepEqual(log[log.length - 1], message);
};

const testMessageInUser = (t, message, user, serverId = 'server1') => {
    const log = t.context.state.get().servers[serverId].userMessages[user];
    const oldLog = t.context.oldState.servers[serverId].userMessages[user];

    t.is(log.length, (oldLog || []).length + 1);
    t.deepEqual(log[log.length - 1], message);
};

const testMessageInAll = (t, message, serverId = 'server1') => {
    testMessageInServer(t, message, serverId);

    const server = t.context.state.get().servers[serverId];

    _(server.userMessages)
    .keys()
    .each(user => testMessageInUser(t, message, user, serverId));

    _(server.channels)
    .keys()
    .each(chan => testMessageInChannel(t, message, chan, serverId));
};

test.beforeEach(t => {
    // Create a mock client getter that implements enough methods
    // to work with the message router
    const createGetClient = id => () => {
        return {
            nick: () => 'PakaluPapito',
            isInChannel: (ch, user = 'PakaluPapito') => {
                const users = t.context.state.get().servers[id].channels[ch].users;
                return users[user] !== null && users[user] !== undefined;
            },
            isChannel: (ch) => ch[0] === '#'
        };
    };

    t.context.state = new Freezer({
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
                        messages: [],
                        users: { seiyria: '', KR: '', SpookyCo: '', PakaluPapito: '' }
                    },
                    '#furry': {
                        messages: [
                            fakeMsg('FurryBoy23', '#furry', 'Love too be furry'),
                            fakeMsg('Furrygirl23', '#furry', 'Same')
                        ],
                        users: { seiyria: '', KR: '', PakaluPapito: '' }
                    },
                    '#empty': {
                        messages: [],
                        users: { PakaluPapito: '' }
                    }
                },
                connected: true,
                getClient: createGetClient('server1')
            },
            server2: {
                id: 'server2',
                messages: [],
                userMessages: {
                    B0T: _.times(100,
                        fakeMsg.bind(null, 'B0T', 'PakaluPapito', 'sexy singles in ur area')
                    )
                },
                channels: {
                },
                connected: true,
                getClient: createGetClient('server2')
            }
        }
    }, { live: false });

    t.context.current = {
        serverId: 'server1',
        channel: '#kellyirc',
        user: undefined
    };

    t.context.oldState = t.context.state.get();
});


test('msg', t => {
    const message = fakeMsg({
        type: 'msg',
        from: 'KR',
        to: '#kellyirc',
        msg: 'hello'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInChannel(t, message, '#kellyirc');
});

test('action', t => {
    const message = fakeMsg({
        type: 'action',
        from: 'seiyria',
        to: '#kellyirc',
        msg: 'slaps PakaluPapito silly with a god damn fish'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInChannel(t, message, '#kellyirc');
});

test('notice', t => {
    const message = fakeMsg({
        type: 'notice',
        from: 'Camel',
        to: 'PakaluPapito',
        msg: 'feed me pls'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInServer(t, message);
    testMessageInUser(t, message, 'Camel');
    testMessageInChannel(t, message, '#kellyirc');
});

test('preconnection notice', t => {
    const message = fakeMsg({
        type: 'notice',
        from: 'server.ircnet.net',
        to: '*',
        msg: '*** No ident server found ***'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInServer(t, message);

    // Test other logs are unmodified
    t.is(
        t.context.state.get().servers['server1'].channels,
        t.context.oldState.servers['server1'].channels
    );
    t.is(
        t.context.state.get().servers['server1'].userMessages,
        t.context.oldState.servers['server1'].userMessages
    );
});

test('invite', t => {
    const message = fakeMsg({
        type: 'invite',
        from: 'Camel',
        chan: '#water'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInServer(t, message);
    testMessageInUser(t, message, 'Camel');
    testMessageInChannel(t, message, '#kellyirc');
});

test('join', t => {
    const message = fakeMsg({
        type: 'join',
        nick: 'SpookyCo',
        chan: '#furry',
        me: false
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInChannel(t, message, '#furry');
});

test('part', t => {
    const message = fakeMsg({
        type: 'part',
        nick: 'SpookyCo',
        chan: '#kellyirc',
        reason: '',
        me: false
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInChannel(t, message, '#kellyirc');
});

test('kick', t => {
    const message = fakeMsg({
        type: 'kick',
        nick: 'SpookyCo',
        kicker: 'KR',
        chan: '#kellyirc',
        reason: '',
        me: false
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInChannel(t, message, '#kellyirc');
});

test('topic', t => {
    const message = fakeMsg({
        type: 'topic',
        chan: '#kellyirc',
        topic: 'The problems are bad, but the causes, the causes are very good'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInChannel(t, message, '#kellyirc');
});

test('topicwho', t => {
    const message = fakeMsg({
        type: 'topicwho',
        chan: '#kellyirc',
        hostmask: 'KR!~KR@78-72-225-13-no193.business.telia.com',
        time: new Date()
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInChannel(t, message, '#kellyirc');
});

test('mode', t => {
    const message = fakeMsg({
        type: 'mode',
        chan: '#kellyirc',
        sender: 'KR',
        mode: '-o+o KR SpookyCo'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInChannel(t, message, '#kellyirc');
});

test('usermode', t => {
    const message = fakeMsg({
        type: 'usermode',
        user: 'PakaluPapito',
        sender: 'CoolIRCOp',
        mode: '+o'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInServer(t, message);
});

test('nick (self)', t => {
    const message = fakeMsg({
        type: 'nick',
        oldNick: 'PakaluPapito',
        newNick: 'PakaluPapito|oh|hell|yea',
        me: true
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInAll(t, message);
});

test('nick (other)', t => {
    const message = fakeMsg({
        type: 'nick',
        oldNick: 'notSeiyria',
        newNick: 'seiyria',
        me: false
    });

    // NOTE: the server reaction will have updated the nicks and moved the
    // userMessages array by now, so the state already uses newNick

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');

    testMessageInChannel(t, message, '#kellyirc');
    testMessageInChannel(t, message, '#furry');
    t.is(t.context.state.get().servers.server1.channels['#empty'].messages.length, 0,
        'The message should not have gone to #empty (seiyria not in that channel)');
    testMessageInUser(t, message, 'seiyria');
    t.not(t.context.state.get().servers.server1.userMessages.notSeiyria,
        'The userMessages under the old nick should not be used');
});

test('connecting', t => {
    const message = fakeMsg({
        type: 'connecting',
        server: 'irc.ircnet.net',
        port: 6667
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    const infoMsg = {
        type: 'info',
        id: message.id,
        timestamp: message.timestamp,
        msg: `Connecting to ${message.server} on port ${message.port}...`
    };

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInServer(t, infoMsg);
});

test('connection-established', t => {
    const message = fakeMsg({
        type: 'connection-established',
        server: 'irc.ircnet.net',
        port: 6667
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    const infoMsg = {
        type: 'info',
        id: message.id,
        timestamp: message.timestamp,
        msg: `Connection to host at ${message.server} established`
    };

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInServer(t, infoMsg);
});

test('reconnecting', t => {
    const message = fakeMsg({
        type: 'reconnecting',
        server: 'irc.ircnet.net',
        port: 6667,
        delay: 5000,
        triesLeft: 2
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    const infoMsg = {
        type: 'info',
        id: message.id,
        timestamp: message.timestamp,
        msg: `Reconnecting in ${message.delay/1000} seconds (${message.triesLeft} tries remaining)...`
    };

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInServer(t, infoMsg);
});

test('connect', t => {
    const message = fakeMsg({
        type: 'connect',
        server: 'irc.ircnet.net',
        port: 6667,
        nick: 'PakaluPapito'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    const infoMsg = {
        type: 'info',
        id: message.id,
        timestamp: message.timestamp,
        msg: 'Connected'
    };

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInServer(t, infoMsg);
});

test('disconnect', t => {
    const message = fakeMsg({
        type: 'disconnect',
        server: 'irc.ircnet.net',
        port: 6667,
        nick: 'PakaluPapito'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    const infoMsg = {
        type: 'info',
        id: message.id,
        timestamp: message.timestamp,
        msg: 'Disconnected'
    };

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInServer(t, infoMsg);
});

test('quit', t => {
    const message = fakeMsg({
        type: 'quit',
        nick: 'seiyria',
        reason: 'peace out doggs',
        channels: ['#kellyirc', '#furry']
    });

    t.context.state.get().servers.server1.channels['#kellyirc'].users.remove('seiyria');
    t.context.state.get().servers.server1.channels['#furry'].users.remove('seiyria');

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInChannel(t, message, '#kellyirc');
    testMessageInChannel(t, message, '#furry');
    t.is(t.context.state.get().servers.server1.channels['#empty'].messages.length, 0,
        'The message should not have gone to #empty (seiyria not in that channel)');
    testMessageInUser(t, message, 'seiyria');
});

test('error', t => {
    const message = fakeMsg({
        type: 'error',
        command: 'ERROR',
        params: ['Connection Timed Out']
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInAll(t, message);
});

test('msg (private message)', t => {
    const message = fakeMsg({
        type: 'msg',
        from: 'KR',
        to: 'PakaluPapito',
        msg: 'hello'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInUser(t, message, 'KR');
});

test('action (private message)', t => {
    const message = fakeMsg({
        type: 'action',
        from: 'seiyria',
        to: 'PakaluPapito',
        msg: 'slaps PakaluPapito silly with a god damn fish'
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInUser(t, message, 'seiyria');
});

test('raw', t => {
    const message = fakeMsg({
        type: 'raw',
        command: 251,
        params: ['There are 11 users and 283 invisible on 23 servers']
        // Other data omitted for brevity
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testModified(t, 'server1');
    testNotModified(t, 'server2');
    testMessageInServer(t, message);
});

test('raw (blacklisted)', t => {
    const message = fakeMsg({
        type: 'raw',
        command: 'JOIN',
        params: ['#empty']
        // Other data omitted for brevity
    });

    MessageRouter({
        message,
        server: t.context.state.get().servers.server1,
        current: t.context.current
    });

    testNotModified(t, 'server1');
    testNotModified(t, 'server2');
});

test('log overflow', t => {
    const message = fakeMsg('B0T', 'PakaluPapito', 'u there?');

    MessageRouter({
        message,
        server: t.context.state.get().servers.server2,
        current: t.context.current
    });

    testNotModified(t, 'server1');
    testModified(t, 'server2');

    const log = t.context.state.get().servers.server2.userMessages.B0T;

    t.is(log.length, 100);
    t.deepEqual(log[log.length - 1], message);
});
