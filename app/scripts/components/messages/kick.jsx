import React from 'react';
import Nick from '../nick';

export default class Kick extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span className='kick'>
                <Nick nick={message.kicker} className='kicker' />&nbsp;
                kicked
                &nbsp;<Nick nick={message.nick} className='kicked'/>&nbsp;
                from {message.chan}&nbsp;{message.reason ? '(' + message.reason + ')' : ''}
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
