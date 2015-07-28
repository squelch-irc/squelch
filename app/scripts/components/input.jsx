import React from 'react';

import {ServerEventAction} from '../actions/server';

export default class Input extends React.Component {

    submitMessage(e) {
        const ENTER_KEY_CODE = 13;

        if(e.keyCode !== ENTER_KEY_CODE) { return; }

        const message = e.target.value.trim();
        if(!message) { return; }

        this.context.executeAction(ServerEventAction, {
            type: 'msg',
            serverId: this.props.serverId,
            data: {
                to: this.props.channel,
                from: 'Me',
                msg: message
            }
        });
    }

    render() {
        return (
            <div className='input-wrapper'>
                <input onKeyDown={this.submitMessage.bind(this)} />
            </div>
        );
    }
}

Input.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
