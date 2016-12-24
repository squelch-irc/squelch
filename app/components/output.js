const html = require('choo/html')
const _ = require('lodash')

const Message = (state, msg, send) => {
  return html`
    <li class="pv1">
      ${JSON.stringify(msg, null, ' ')}
    </li>
  `
}

module.exports = (state, log, send) => {
  return html`
    <div class="flex-grow overflow-y-scroll overflow-x-scroll break-word">
      <ul class="list flex flex-column ma0 pa0 w-100 h-100">
        ${log.map(msg => Message(state, msg, send))}
      </ul>

    </div>
  `
}
