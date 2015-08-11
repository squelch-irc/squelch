import React from 'react';

export default class Usermode extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>
                <span className='sender'>{message.sender}</span>
                &nbsp;sets mode <span className='mode'>{message.mode}</span>
            </span>
        );
    }
}
