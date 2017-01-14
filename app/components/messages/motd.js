const html = require('choo/html')

module.exports = (state, {motd}, send) => {
  return html`
    <pre>${motd}</pre>
  `
}
