const html = require('choo/html')
const cn = require('classnames')
const _ = require('lodash')

const { isActive, getCurrentChannel, getCurrentPrivMsg } = require('../models/util')
const ListItem = require('../elements/sidebarListItem')

const ConnectionIndicator = connected => {
  // TODO: handle more connection states (connecting)
  const classes = cn('w-tiny h-tiny br-100 mr2', {
    'bg-dark-green': connected,
    'bg-near-white o-40': !connected
  })
  return html`
    <span class=${classes}></span>
  `
}

const ChannelListItem = (state, server, chan, send) => {
  return ListItem({
    text: chan.name,
    active: isActive(state, server.id, chan.name),
    highlighted: false,
    onClick: () => send('gotoChannel', { serverId: server.id, channel: chan.name })
  })
}

const PrivMsgListItem = (state, server, nick, send) => {
  return ListItem({
    text: nick,
    active: isActive(state, server.id, null, nick),
    highlighted: false,
    onClick: () => send('gotoPrivMsg', { serverId: server.id, user: nick })
  })
}

const ServerListItem = (state, server, send) => {
  const desiredNick = state.config.servers[server.name].nick
  const active = isActive(state, server.id) &&
    !getCurrentChannel(state) &&
    !getCurrentPrivMsg(state)

  const classNames = cn('mv2 pv2 pl3 pointer', {
    'hover-bg-mid-gray': !active,
    'bg-blue hover-bg-light-blue': active
  })

  const onClick = () => {
    if (!active) send('gotoServer', { serverId: server.id })
  }

  return html`
    <div class=${classNames} onclick=${onClick}>
      <h1 class="f4 mt0 mb2">${server.name}</h1>
      <h2 class="flex items-center f7 fw3 mv0">
        ${ConnectionIndicator(server.connected)}
        <span class="o-40">${server.client.nick() || desiredNick}</span>
      </h2>
    </div>
  `
}

const Server = (state, id, send) => {
  const server = state.servers[id]
  return html`
    <div>
      ${ServerListItem(state, server, send)}
      <h2 class="f7 fw4 ttu tracked o-40 mt0 mb1 pl3">Channels</h2>
      <ul class="list f5 fw3 mt0 mb2 ph0">
        ${_.map(server.channels, chan => ChannelListItem(state, server, chan, send))}
      </ul>
      <h2 class="f7 fw4 ttu tracked o-40 mt0 mb1 pl3">Private Messages</h2>
      <ul class="list f5 fw3 mt0 mb2 ph0">
        ${_.map(server.userMessages, (msgs, nick) => PrivMsgListItem(state, server, nick, send))}
      </ul>
    </div>
  `
}

module.exports = (state, prev, send) => {
  return html`
    <nav class="flex-none h-100 w-sidebar overflow-scroll near-white bg-dark-gray">
      ${_.map(state.servers, (server, id) => Server(state, id, send))}
    </nav>
  `
}
