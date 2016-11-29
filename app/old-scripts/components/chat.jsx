const _ = require('lodash')
const React = require('react')
const ReactDOM = require('react-dom')

const Message = require('./message')

class Chat extends React.Component {

  shouldComponentUpdate (newProps) {
    return this.props.messages !== newProps.messages
  }

  render () {
    const messages = this.props.messages
    return (
      <div className='message-container'>
        <ul className='messages'>{
                    _.map(messages, (message) =>
                      <Message message={message} key={message.id} />
                    )
                }</ul>
      </div>
        )
  }

  componentWillUpdate () {
    const node = ReactDOM.findDOMNode(this)
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight
  }

  componentDidUpdate () {
    if (this.shouldScrollBottom) {
      const node = ReactDOM.findDOMNode(this)
      node.scrollTop = node.scrollHeight
    }
  }
}

Chat.propTypes = {
  messages: React.PropTypes.arrayOf(
        React.PropTypes.shape({
          id: React.PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
  channel: React.PropTypes.string
}

module.exports = Chat
