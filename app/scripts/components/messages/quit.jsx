import React from 'react';

export default class Quit extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>
                ←&nbsp;<span className='sender'>{message.nick}</span>&nbsp;
                <span className='message-info'>has quit&nbsp;{message.reason ? '(' + message.reason + ')' : ''}</span>
            </span>
        );
    }
}
