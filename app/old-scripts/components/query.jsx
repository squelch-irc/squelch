const React = require('react')

const Chat = require('./chat')
const Input = require('./input')
const checkPropsChanged = require('../util/checkPropsChanged')

class QueryView extends React.Component {
  shouldComponentUpdate (newProps) {
    return checkPropsChanged(
            this.props, newProps,
            'serverId', 'user', 'messages'
        )
  }

  render () {
    const { serverId, messages, user } = this.props

    return (
      <div className='server-view pane-group'>
        <div className='io-container pane'>
          <Chat messages={messages} />
          <Input serverId={serverId} target={user} />
        </div>
      </div>
        )
  }
}

QueryView.propTypes = {
  messages: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  serverId: React.PropTypes.string.isRequired,
  user: React.PropTypes.string.isRequired
}

module.exports = QueryView
