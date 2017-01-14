const html = require('choo/html')
const _ = require('lodash')

module.exports = (state, {msg, render}, send) => {
  let content = msg
  if (Array.isArray(msg)) {
    content = msg.map(msg => (render || _.identity)(msg))
  }

  return html`
    <span>${content}</span>
  `
}
