const html = require('choo/html')

const Nick = require('../nick')

module.exports = (state, {me, oldNick, newNick}, send) => {
  if (me) {
    return html`
      <span>You are now known as ${Nick(state, {nick: newNick}, send)}</span>
    `
  }

  return html`
    <span>${Nick(state, {nick: oldNick}, send)} is now known as ${Nick(state, {nick: newNick}, send)}</span>
  `
}
