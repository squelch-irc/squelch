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

Usermode.propTypes = {
    message: React.PropTypes.shape({
        sender: React.PropTypes.string.isRequired,
        mode: React.PropTypes.string.isRequired
    }).isRequired
};
