const React = require('react');

const UserList = require('./userlist');
const Topic = require('./topic');
const Chat = require('./chat');
const Input = require('./input');
const checkPropsChanged = require('../util/checkPropsChanged');

class ChannelView extends React.Component {
    shouldComponentUpdate(newProps) {
        return checkPropsChanged(this.props, newProps, 'serverId', 'channel');
    }

    render() {
        const { serverId } = this.props;
        const { messages, users, topic, name } = this.props.channel;

        return (
            <div className='channel-view pane-group'>
                <div className='io-container pane'>
                    <Topic topic={topic} />
                    <Chat messages={messages} channel={name} />
                    <Input serverId={serverId} target={name} />
                </div>
                <UserList users={users} />
            </div>
        );
    }
}

ChannelView.propTypes = {
    serverId: React.PropTypes.string.isRequired,
    channel: React.PropTypes.shape({
        messages: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        users: React.PropTypes.object.isRequired,
        topic: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired
    }).isRequired
};

module.exports = ChannelView;
