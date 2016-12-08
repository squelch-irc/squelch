const html = require('choo/html')
const Sidebar = require('../components/sidebar')

module.exports = (state, prev, send) => html`
  <main class="flex near-black bg-near-white">
    ${Sidebar(state, prev, send)}
  </main>
`
