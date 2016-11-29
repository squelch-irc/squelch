const React = require('react')
const Nick = require('../nick')

class Mode extends React.Component {
  render () {
    const message = this.props.message

    return (
      <span className='message-info mode-set'>
        <Nick nick={message.sender} />
        <span className='mode'>{message.mode}</span>
      </span>
        )
  }
}

Mode.propTypes = {
  message: React.PropTypes.shape({
    sender: React.PropTypes.string.isRequired,
    mode: React.PropTypes.string.isRequired

  }).isRequired
}

module.exports = Mode
