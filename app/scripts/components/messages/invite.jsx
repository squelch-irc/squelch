import React from 'react';

export default class Invite extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>
                &raquo;&nbsp;&lt;<span className='sender invite'>{message.from}</span>&gt; has invited you to join <span className='sender-message invite-channel'>{message.chan}</span>.
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
