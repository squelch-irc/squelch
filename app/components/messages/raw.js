const html = require('choo/html')

const Nick = require('../nick')

module.exports = (state, {params}, send) => {
  return html`
    <span>${params.slice(1).join(' ')}</span>
  `
}
