const html = require('choo/html')

const Timestamp = require('./timestamp')

module.exports = (state, msg, send) => {
  return html`
    <li class="ph2 pt1 flex items-baseline lh-copy">
      ${Timestamp(msg.timestamp)}
      <div class="flex-grow">${JSON.stringify(msg, null, ' ')}</div>
    </li>
  `
}
