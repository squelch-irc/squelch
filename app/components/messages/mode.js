const html = require('choo/html')

const Nick = require('../nick')

module.exports = (state, {sender, mode}, send) => {
  return html`
    <span>${Nick(state, {nick: sender}, send)} set mode ${mode}</span>
  `
}
