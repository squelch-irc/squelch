import React from 'react';

import State from '../stores/state';

export default class Input extends React.Component {

    submitMessage(e) {
        const ENTER_KEY_CODE = 13;

        if(e.keyCode !== ENTER_KEY_CODE) { return; }

        const message = e.target.value.trim();
        if(!message) { return; }

        State.trigger('message:send', {
            serverId: this.props.serverId,
            to: this.props.target,
            msg: message
        });

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
    target: React.PropTypes.string
};
