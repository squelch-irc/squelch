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

Part.propTypes = {
    message: React.PropTypes.shape({
        nick: React.PropTypes.string.isRequired,
        chan: React.PropTypes.string.isRequired,
        reason: React.PropTypes.string
    }).isRequired
};
