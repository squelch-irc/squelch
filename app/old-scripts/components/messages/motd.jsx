const React = require('react')

class Motd extends React.Component {
  render () {
    const message = this.props.message

    return (
      <span className='message-info motd'><pre className='motd-text'>{message.motd}</pre></span>
        )
  }
}

Motd.propTypes = {
  message: React.PropTypes.shape({
    motd: React.PropTypes.string.isRequired
  }).isRequired
}

module.exports = Motd
