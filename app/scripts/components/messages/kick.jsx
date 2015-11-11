import React from 'react';

export default class Kick extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>
                <span className='sender'>{message.kicker}</span>&nbsp;
                <span className='message-info'>kicked {message.nick} from {message.chan}&nbsp;{message.reason ? '(' + message.reason + ')' : ''}</span>
            </span>
        );
    }
}

Kick.propTypes = {
    message: React.PropTypes.shape({
        kicker: React.PropTypes.string.isRequired,
        chan: React.PropTypes.string.isRequired,
        nick: React.PropTypes.string.isRequired,
        reason: React.PropTypes.string
    }).isRequired
};
