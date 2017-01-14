const html = require('choo/html')

const Nick = require('../nick')

module.exports = (state, {from, msg}, send) => {
  return html`
    <span>${Nick(state, {nick: from, appendText: ':'}, send)} ${msg}</span>
  `
}
