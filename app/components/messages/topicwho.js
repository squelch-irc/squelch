const html = require('choo/html')
const moment = require('moment')

module.exports = (state, {hostmask, time}, send) => {
  return html`
    <span>Set by ${hostmask} on ${moment(time).format('LLLL')}</span>
  `
}
