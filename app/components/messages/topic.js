const html = require('choo/html')

module.exports = (state, {topic}, send) => {
  if (topic) {
    return html`
      <span>Topic is ${topic}</span>
    `
  }
  return null
}
