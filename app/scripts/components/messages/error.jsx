import React from 'react';

export default class Error extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span className='message-error'>
                Error: {message.params.join(' ')}
            </span>
        );
    }
}
