const html = require('choo/html')
const _ = require('lodash')

module.exports = (state, serverId, channel, send) => {
  const { users } = state.servers[serverId].channels[channel]
  return html`
    <nav class="pa3 h-100 w4 overflow-scroll near-white bg-dark-gray">
      <h2 class="f7 fw4 ttu tracked o-40 mt0 mb1">Users</h2>
      <ul class="list f6 fw3 mt0 mb2 ph0">
        ${_.map(users, (status, nick) =>
          html`<li class="o-70 pv1">${nick}</li>`)}
      </ul>
    </nav>
  `
}
