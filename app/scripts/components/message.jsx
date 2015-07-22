import React from 'react';

import Msg from './messages/msg';
import Action from './messages/action';
import Timestamp from './messages/timestamp';

const messageHandlers = {
    msg: Msg,
    action: Action
};

export default class Message extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const message = this.props.message;
        const MessageHandler = messageHandlers[message && message.type];
        if(!MessageHandler) {
            return null;
        }
        return (
            <li className='message'>
                <Timestamp timestamp={message.timestamp} />
                &nbsp;
                <MessageHandler message={message} />
            </li>
        );
    }
}
