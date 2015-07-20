import React from 'react';
import UserList from './userlist';
import Chat from './chat';
import Input from './input';

class ChannelView extends React.Component {
    render() {
        // <div>Hello {this.props.serverId}, {this.props.channel}</div>
        return (
            <div className='channel-view'>
                <div className='io-container'>
                    <Chat /><Input />
                </div>
                <UserList />
            </div>
        );
    }
};

export default ChannelView;
