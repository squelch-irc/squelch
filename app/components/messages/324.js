const html = require('choo/html')

module.exports = (state, {params}, send) => {
  const mode = this.props.message.params.slice(2)

  return html`
    <span>Mode is ${mode.join(' ')}</span>
  `
}
