const html = require('choo/html')

const Nick = require('../nick')

module.exports = (state, {from, chan}, send) => {
  return html`
    <span>» ${Nick(state, {nick: from}, send)} has invited you to join ${chan}</span>
  `
}
