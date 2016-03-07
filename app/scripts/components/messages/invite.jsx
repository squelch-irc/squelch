import React from 'react';
import Nick from '../nick';

export default class Invite extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='invite'>
                <Nick nick={message.from} /> has invited you to join {message.chan}
            </span>
        );
    }
}

Invite.propTypes = {
    message: React.PropTypes.shape({
        from: React.PropTypes.string.isRequired,
        chan: React.PropTypes.string.isRequired
    }).isRequired
};
