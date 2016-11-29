const React = require('react')
const Nick = require('../nick')

class Quit extends React.Component {
  render () {
    const message = this.props.message

    return (
      <span className='message-info quit'>
        <Nick nick={message.nick} />&nbsp;
        {message.reason ? '(' + message.reason + ')' : ''}
      </span>
        )
  }
}

Quit.propTypes = {
  message: React.PropTypes.shape({
    nick: React.PropTypes.string.isRequired,
    reason: React.PropTypes.string
  }).isRequired
}

module.exports = Quit
