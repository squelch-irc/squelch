import React from 'react';
import connectToStores from 'alt/utils/connectToStores';

import MessageStore from '../stores/messages';

import Chat from './chat';
import Input from './input';

@connectToStores
export default class ServerView extends React.Component {
    static getStores() { return [MessageStore]; }
    static getPropsFromStores() { return MessageStore.getState(); }

    shouldComponentUpdate(newProps) {
        const oldMessages = this.props.messages[this.props.params.serverId]
            .serverMessages;
        const newMessages = newProps.messages[newProps.params.serverId]
            .serverMessages;
        return oldMessages !== newMessages;
    }

    render() {
        const { serverId } = this.props.params;
        const { messages } = this.props;

        let serverMessages = null;
        if(messages[serverId]) {
            serverMessages = messages[serverId].serverMessages;
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

ServerView.propTypes = {
    params: React.PropTypes.shape({
        serverId: React.PropTypes.string.isRequired
    }).isRequired
};
