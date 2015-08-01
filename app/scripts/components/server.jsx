import {connectToStores} from 'fluxible-addons-react';

import MessageStore from '../stores/messages';
import React from 'react';
import Chat from './chat';
import Input from './input';

@connectToStores([MessageStore], context => context.getStore(MessageStore).getState())
class ServerView extends React.Component {

    render() {
        const {serverId, messages} = this.props;
        let serverMessages = [];
        if(messages[serverId]) {
            serverMessages = messages[serverId].serverMessages;
        }
        return (
            <div className='server-view'>
                <div className='io-container'>
                    <Chat messages={serverMessages} /><Input serverId={serverId} />
                </div>
            </div>
        );
    }
}

export default ServerView;
