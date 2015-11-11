import React from 'react';

export default class Join extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>
                →&nbsp;<span className='sender'>{message.nick}</span>&nbsp;
                <span className='message-info'>has joined {message.chan}</span>
            </span>
        );
    }
}

Join.propTypes = {
    message: React.PropTypes.shape({
        nick: React.PropTypes.string.isRequired,
        chan: React.PropTypes.string.isRequired
    }).isRequired
};
