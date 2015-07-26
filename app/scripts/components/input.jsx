import React from 'react';

import {ServerEventAction} from '../actions/server';

export default class Input extends React.Component {

    render() {

        const submitMessage = (e) => {
            const ENTER_KEY_CODE = 13;

            if(e.keyCode !== ENTER_KEY_CODE) return;
            let message = e.target.value.trim();
            if(!message) return;

            this.context.executeAction(ServerEventAction, {
                to: this.props.channel,
                from: 'Me',
                msg: message
            });
        };

        return (
            <div className='input-wrapper'>
                <input onKeyDown={submitMessage} />
            </div>
        );
    }
}
