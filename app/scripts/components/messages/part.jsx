import React from 'react';

export default class Part extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>
                ←&nbsp;<span className='sender'>{message.nick}</span>&nbsp;
                <span className='message-info'>has left {message.chan}&nbsp;{message.reason ? '(' + message.reason + ')' : ''}</span>
            </span>
        );
    }
}
