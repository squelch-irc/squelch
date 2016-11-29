const moment = require('moment')
const React = require('react')

class TopicWho extends React.Component {
  render () {
    const message = this.props.message

    return (
      <span className='message-info topic-who'>
        <span className='topic-setter'>{message.hostmask}</span>
        <span className='topic-time'>{moment(message.time).format('LLLL')}</span>
      </span>
        )
  }
}

TopicWho.propTypes = {
  message: React.PropTypes.shape({
    hostmask: React.PropTypes.string.isRequired,
    time: React.PropTypes.instanceOf(Date).isRequired
  }).isRequired
}

module.exports = TopicWho
