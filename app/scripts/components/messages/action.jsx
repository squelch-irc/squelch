import React from 'react';
import Nick from '../nick';

export default class Action extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='action'>
                •&nbsp;<Nick nick={message.from} />&nbsp;
                {message.msg}
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
