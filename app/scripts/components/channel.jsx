import React from 'react';
import connectToStores from 'alt/utils/connectToStores';

import MessageStore from '../stores/messages';
import ServerStore from '../stores/servers';

import UserList from './userlist';
import Chat from './chat';
import Input from './input';

@connectToStores
class ChannelView extends React.Component {
    static getStores() { return [MessageStore, ServerStore]; }
    static getPropsFromStores() {
        return {
            messages: MessageStore.getState().messages,
            servers: ServerStore.getState().servers
        };
    }

    shouldComponentUpdate(newProps) {
        const oldServerId = this.props.params.serverId;
        const newServerId = newProps.params.serverId;

        const oldChannelName = decodeURIComponent(this.props.params.channel);
        const newChannelName = decodeURIComponent(newProps.params.channel);

        const oldMessages = this.props.messages[oldServerId].channels[oldChannelName];
        const newMessages = newProps.messages[newServerId].channels[newChannelName];

        const oldChannel = this.props.servers[oldServerId].channels[oldChannelName];
        const newChannel = newProps.servers[newServerId].channels[newChannelName];

        return oldMessages !== newMessages || oldChannel !== newChannel;
    }

    render() {
        const { serverId } = this.props.params;
        const { messages, servers } = this.props;
        const channel = decodeURIComponent(this.props.params.channel);

        let chanMessages = null;
        if(messages[serverId] && messages[serverId].channels[channel]) {
            chanMessages = messages[serverId].channels[channel];
        }

        let users = null;
        if(servers[serverId] && servers[serverId].channels[channel]) {
            users = servers[serverId].channels[channel].users;
        }

        return (
            <div className='channel-view'>
                <div className='io-container'>
                    <Chat messages={chanMessages} />
                    <Input serverId={serverId} channel={channel} />
                </div>
                <UserList users={users} />
            </div>
        );
    }
}

export default ChannelView;
