const html = require('choo/html')
const moment = require('moment')

const TIMESTAMP_FORMAT = 'h:mm:ss a'

module.exports = (timestamp) => {
  const formattedTimestamp = moment(timestamp).format(TIMESTAMP_FORMAT)

  return html`
    <span class="f7 o-40 mr2">[${formattedTimestamp}]</span>
  `
}
