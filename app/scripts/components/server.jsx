import React from 'react';

import Chat from './chat';
import Input from './input';

export default class ServerView extends React.Component {
    shouldComponentUpdate(newProps) {
        const oldMessages = this.props.state.servers[this.props.params.serverId].messages;
        const newMessages = newProps.state.servers[newProps.params.serverId].messages;
        return oldMessages !== newMessages;
    }

    render() {
        const { serverId } = this.props.params;
        const messages = this.props.state.servers[serverId].messages;

        return (
            <div className='server-view pane-group'>
                <div className='io-container pane'>
                    <Chat messages={messages} />
                    <Input serverId={serverId} />
                </div>
            </div>
        );
    }
}

ServerView.propTypes = {
    state: React.PropTypes.object.isRequired,
    params: React.PropTypes.shape({
        serverId: React.PropTypes.string.isRequired
    }).isRequired
};
