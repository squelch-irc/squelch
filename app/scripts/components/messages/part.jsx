import React from 'react';
import Nick from '../nick';

export default class Part extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='part'>
                <Nick nick={message.nick} />&nbsp;
                has left {message.chan}&nbsp;{message.reason ? '(' + message.reason + ')' : ''}
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
