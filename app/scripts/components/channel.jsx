const React = require('react');

const UserList = require('./userlist');
const Topic = require('./topic');
const Chat = require('./chat');
const Input = require('./input');
const WelcomeView = require('./welcome');

class ChannelView extends React.Component {
    shouldComponentUpdate(newProps) {
        const oldServerId = this.props.params.serverId;
        const newServerId = newProps.params.serverId;

        const oldChannelName = decodeURIComponent(this.props.params.channel);
        const newChannelName = decodeURIComponent(newProps.params.channel);

        const oldChannel = this.props.state.servers[oldServerId].channels[oldChannelName];
        const newChannel = newProps.state.servers[newServerId].channels[newChannelName];

        return oldChannel !== newChannel;
    }

    render() {
        const { serverId } = this.props.params;
        const { servers } = this.props.state;
        const channel = decodeURIComponent(this.props.params.channel);

        if(!servers[serverId].channels[channel]) {
            return <WelcomeView />;
        }

        const messages = servers[serverId].channels[channel].messages;

        let users = null;
        if(servers[serverId] && servers[serverId].channels[channel]) {
            users = servers[serverId].channels[channel].users;
        }

        let topic = '';
        if(servers[serverId] && servers[serverId].channels[channel]) {
            topic = servers[serverId].channels[channel].topic;
        }

        return (
            <div className='channel-view pane-group'>
                <div className='io-container pane'>
                    <Topic topic={topic} />
                    <Chat messages={messages} channel={channel} />
                    <Input serverId={serverId} target={channel} />
                </div>
                <UserList users={users} />
            </div>
        );
    }
}

ChannelView.propTypes = {
    state: React.PropTypes.object.isRequired,
    params: React.PropTypes.shape({
        serverId: React.PropTypes.string.isRequired,
        channel: React.PropTypes.string.isRequired
    }).isRequired
};

module.exports = ChannelView;
