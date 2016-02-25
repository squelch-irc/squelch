import React from 'react';

import UserList from './userlist';
import Topic from './topic';
import Chat from './chat';
import Input from './input';

export default class ChannelView extends React.Component {
    shouldComponentUpdate(newProps) {
        const oldServerId = this.props.params.serverId;
        const newServerId = newProps.params.serverId;

        const oldChannelName = decodeURIComponent(this.props.params.channel);
        const newChannelName = decodeURIComponent(newProps.params.channel);

        const oldMessages = this.props.state.messages[oldServerId].channels[oldChannelName];
        const newMessages = newProps.state.messages[newServerId].channels[newChannelName];

        const oldChannel = this.props.state.servers[oldServerId].channels[oldChannelName];
        const newChannel = newProps.state.servers[newServerId].channels[newChannelName];

        const oldTopic = this.props.state.servers[oldServerId].channels[oldChannelName].topic;
        const newTopic = this.props.state.servers[newServerId].channels[newChannelName].topic;

        return oldMessages !== newMessages || oldChannel !== newChannel || oldTopic !== newTopic;
    }

    render() {
        const { serverId } = this.props.params;
        const { messages, servers } = this.props.state;
        const channel = decodeURIComponent(this.props.params.channel);

        let chanMessages = null;
        if(messages[serverId] && messages[serverId].channels[channel]) {
            chanMessages = messages[serverId].channels[channel];
        }

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
                    <Chat messages={chanMessages} channel={channel} />
                    <Input serverId={serverId} channel={channel} />
                </div>
                <UserList users={users} />
            </div>
        );
    }
}

ChannelView.propTypes = {
    params: React.PropTypes.shape({
        serverId: React.PropTypes.string.isRequired,
        channel: React.PropTypes.string.isRequired
    }).isRequired
};
