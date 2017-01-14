const html = require('choo/html')

const Nick = require('../nick')

module.exports = (state, {nick, chan}, send) => {
  return html`
    <span>→ ${Nick(state, {nick}, send)} has joined ${chan}</span>
  `
}
