const html = require('choo/html')

const Nick = require('../nick')

module.exports = (state, {kicker, chan, nick, reason}, send) => {
  reason = reason ? `(${reason})` : ''
  return html`
    <span>
      ${Nick(state, {nick: kicker}, send)}
      kicked ${Nick(state, {nick}, send)} from ${chan} ${reason}
    </span>
  `
}
