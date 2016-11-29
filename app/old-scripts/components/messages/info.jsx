const React = require('react')
const _ = require('lodash')

class Info extends React.Component {
  render () {
    const message = this.props.message

    if (message.msg instanceof Array) {
      return <span className='message-info'>{message.msg.map(msg =>
                (message.render || _.identity)(msg)
            )}
      </span>
    }

    return <span className='message-info'>{message.msg}</span>
  }
}

Info.propTypes = {
  message: React.PropTypes.shape({
    msg: React.PropTypes.string.isRequired
  }).isRequired
}

module.exports = Info
