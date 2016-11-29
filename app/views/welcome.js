const html = require('choo/html')
const Button = require('../elements/btn')

module.exports = (state, prev, send) => html`
  <main class="flex flex-column justify-center items-center tc light-gray bg-near-black">
    <h1 class="f1 mb0">Welcome!</h1>
    <h2 class="f6 mb4 gray">Let's get you into an IRC server.</h2>
    ${Button({
      label: 'Join a Server',
      onClick: () => send('gotoSelectServer')
    })}
  </main>
`
