const React = require('react')

class Topic extends React.Component {
  render () {
    const message = this.props.message

        // Ignore no topic messages
    if (message.topic) {
      return (
        <span className='message-info topic'>
          <span className='topic-text'>{message.topic}</span>
        </span>
            )
    }

    return <span className='message-info topic no-topic'>
            No topic is set
    </span>
  }
}

Topic.propTypes = {
  message: React.PropTypes.shape({
    topic: React.PropTypes.string.isRequired
  }).isRequired
}

module.exports = Topic
