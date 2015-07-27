import React from 'react';

import Msg from './messages/msg';
import Action from './messages/action';
import Join from './messages/join';
import Part from './messages/part';
import Kick from './messages/kick';
import Timestamp from './messages/timestamp';

const messageHandlers = {
    msg: Msg,
    action: Action,
    join: Join,
    part: Part,
    kick: Kick
};

export default class Message extends React.Component {

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
