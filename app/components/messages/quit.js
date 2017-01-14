const html = require('choo/html')

const Nick = require('../nick')

module.exports = (state, {nick, reason}, send) => {
  reason = reason ? `(${reason})` : ''
  return html`
    <span>← ${Nick(state, {nick}, send)} has quit ${reason}</span>
  `
}