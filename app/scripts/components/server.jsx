import React from 'react';

import Chat from './chat';
import Input from './input';

export default class ServerView extends React.Component {
    shouldComponentUpdate(newProps) {
        const oldMessages = this.props.state.messages[this.props.params.serverId]
            .serverMessages;
        const newMessages = newProps.state.messages[newProps.params.serverId]
            .serverMessages;
        return oldMessages !== newMessages;
    }

    render() {
        const { serverId } = this.props.params;
        const { messages } = this.props.state;

        let serverMessages = null;
        if(messages[serverId]) {
            serverMessages = messages[serverId].serverMessages;
        }

        return (
            <div className='server-view pane-group'>
                <div className='io-container pane'>
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
