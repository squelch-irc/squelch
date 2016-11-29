const React = require('react')
const Nick = require('../nick')

class Kick extends React.Component {
  render () {
    const message = this.props.message
    return (
      <span className='message-info kick'>
        <Nick nick={message.kicker} className='kicker' />&nbsp;
                kicked
        <Nick nick={message.nick} className='kicked' />&nbsp;
        {message.chan}&nbsp;{message.reason ? '(' + message.reason + ')' : ''}
      </span>
        )
  }
}

Kick.propTypes = {
  message: React.PropTypes.shape({
    kicker: React.PropTypes.string.isRequired,
    chan: React.PropTypes.string.isRequired,
    nick: React.PropTypes.string.isRequired,
    reason: React.PropTypes.string
  }).isRequired
}

module.exports = Kick
