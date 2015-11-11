import React from 'react';

export default class Action extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>
                •&nbsp;<span className='sender'>{message.from}</span>&nbsp;
                <span className='sender-message'>{message.msg}</span>
            </span>
        );
    }
}

Action.propTypes = {
    message: React.PropTypes.shape({
        from: React.PropTypes.string.isRequired,
        msg: React.PropTypes.string.isRequired
    }).isRequired
};
