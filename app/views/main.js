const html = require('choo/html')

const Sidebar = require('../components/sidebar')
const UserList = require('../components/user-list')
const Output = require('../components/output')
const { getCurrentServerId, getCurrentChannel, getCurrentPrivMsg } = require('../models/util')

module.exports = (state, prev, send) => {
  const serverId = getCurrentServerId(state)
  const channel = getCurrentChannel(state)
  const user = getCurrentPrivMsg(state)

  let currentLog
  if (channel) {
    currentLog = state.servers[serverId].channels[channel].messages
  } else if (user) {
    currentLog = state.servers[serverId].userMessages[user]
  } else {
    currentLog = state.servers[serverId].messages
  }

  return html`
    <main class="flex near-black bg-near-white">
      ${Sidebar(state, prev, send)}
      <div class="flex flex-column flex-grow">
        <div class="flex flex-grow">
          ${Output(state, currentLog, send)}
          ${channel ? UserList(state, serverId, channel, send) : ''}
        </div>
        <div class="bg-light-blue">TODO: Status Bar</div>
      </div>
    </main>
  `
}
