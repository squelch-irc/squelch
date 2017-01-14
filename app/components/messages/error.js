const html = require('choo/html')

module.exports = (state, {params}, send) => {
  return html`
    <span>Error: ${params.join(' ')}</span>
  `
}
