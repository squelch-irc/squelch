import React from 'react';
import Nick from '../nick';

export default class Usermode extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='usermode-set'>
                <Nick nick={message.sender} />
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
