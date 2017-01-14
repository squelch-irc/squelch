const html = require('choo/html')

const Message = require('./message')

module.exports = (state, log, send) => {
  return html`
    <div class="flex-grow overflow-y-scroll overflow-x-scroll break-word">
      <ul class="list f6 flex flex-column ma0 pa0 w-100">
        ${log.map(msg => Message(state, msg, send))}
      </ul>

    </div>
  `
}
