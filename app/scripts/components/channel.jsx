import {connectToStores} from 'fluxible-addons-react';

import MessageStore from '../stores/messages';
import React from 'react';
import UserList from './userlist';
import Chat from './chat';
import Input from './input';

@connectToStores([MessageStore], (context) => context.getStore(MessageStore).getState())
class ChannelView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {serverId, channel, messages} = this.props;
        let chanMessages = [];
        if(messages[serverId] && messages[serverId][channel]) {
            chanMessages = messages[serverId][channel];
        }
        return (
            <div className='channel-view'>
                <div className='io-container'>
                    <Chat messages={chanMessages} /><Input />
                </div>
                <UserList serverId={serverId} channel={channel} />
            </div>
        );
    }
}

export default ChannelView;
