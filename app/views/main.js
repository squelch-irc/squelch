const html = require('choo/html')

const Sidebar = require('../components/sidebar')
const UserList = require('../components/user-list')
const { getCurrentServerId, getCurrentChannel } = require('../models/util')

module.exports = (state, prev, send) => {
  const serverId = getCurrentServerId(state)
  const channel = getCurrentChannel(state)

  return html`
    <main class="flex near-black bg-near-white">
      ${Sidebar(state, prev, send)}
      <div class="flex flex-column flex-grow">
        <div class="flex flex-grow">
          <div class="flex-grow bg-near-white">TODO: output</div>
          ${channel ? UserList(state, serverId, channel, send) : ''}
        </div>
        <div class="bg-light-blue">TODO: Status Bar</div>
      </div>
    </main>
  `
}
