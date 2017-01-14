const html = require('choo/html')
const { nickColor } = require('../models/util')

module.exports = (state, {nick, appendText, prependText}, send) => {
  const text = (prependText || '') + nick + (appendText || '')

  return html`
    <span class=${nickColor(nick)}>${text}</span>
  `
}
