import React from 'react';

import State from '../stores/state';

export default class Input extends React.Component {

    submitMessage(e) {
        const ENTER_KEY_CODE = 13;

        if(e.keyCode !== ENTER_KEY_CODE) { return; }

        const message = e.target.value.trim();
        if(!message) { return; }

        if(this.props.channel) {
            State.trigger('message:send', {
                serverId: this.props.serverId,
                to: this.props.channel,
                msg: message
            });
        }
        // TODO: do something when channel isn't provided (server view)

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

Input.propTypes = {
    serverId: React.PropTypes.string.isRequired,
    channel: React.PropTypes.string
};
