import React from 'react';
import Nick from '../nick';

export default class Quit extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='quit'>
                <Nick nick={message.nick} />&nbsp;
                has quit&nbsp;{message.reason ? '(' + message.reason + ')' : ''}
            </span>
        );
    }
}

Quit.propTypes = {
    message: React.PropTypes.shape({
        nick: React.PropTypes.string.isRequired,
        reason: React.PropTypes.string
    }).isRequired
};
