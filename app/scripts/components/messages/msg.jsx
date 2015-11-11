import React from 'react';

export default class Msg extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>
                &lt;<span className='sender'>{message.from}</span>&gt;&nbsp;
                <span className='sender-message'>{message.msg}</span>
            </span>
        );
    }
}

Msg.propTypes = {
    message: React.PropTypes.shape({
        from: React.PropTypes.string.isRequired,
        msg: React.PropTypes.string.isRequired
    }).isRequired
};
