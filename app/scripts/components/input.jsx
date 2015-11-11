import React from 'react';

import ChannelActions from '../actions/channel';

export default class Input extends React.Component {

    submitMessage(e) {
        const ENTER_KEY_CODE = 13;

        if(e.keyCode !== ENTER_KEY_CODE) { return; }

        const message = e.target.value.trim();
        if(!message) { return; }

        if(this.props.channel) {
            ChannelActions.sendMessage({
                serverId: this.props.serverId,
                to: this.props.channel,
                msg: message
            });
        }

        e.target.value = '';
    }

    render() {
        return (
            <div className='input-wrapper'>
                <input onKeyDown={this.submitMessage.bind(this)} />
            </div>
        );
    }
}
