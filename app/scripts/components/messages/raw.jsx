import React from 'react';

export default class Raw extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>
                <span className='message-info'>{message.params.slice(1).join(' ')}</span>
            </span>
        );
    }
}
