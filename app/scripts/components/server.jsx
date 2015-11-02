import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import pureRender from 'pure-render-decorator';

import MessageStore from '../stores/messages';

import Chat from './chat';
import Input from './input';

@connectToStores
@pureRender
class ServerView extends React.Component {
    static getStores() { return [MessageStore]; }
    static getPropsFromStores() { return MessageStore.getState(); }

    render() {
        const { serverId } = this.props.params;
        const { messages } = this.props;

        let serverMessages = null;
        if(messages.has(serverId)) {
            serverMessages = messages.get(serverId).serverMessages;
        }

        return (
            <div className='server-view'>
                <div className='io-container'>
                    <Chat messages={serverMessages} />
                    <Input serverId={serverId} />
                </div>
            </div>
        );
    }
}

export default ServerView;
