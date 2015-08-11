import React from 'react';

export default class Info extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span className='message-info'>{message.msg}</span>
        );
    }
}
