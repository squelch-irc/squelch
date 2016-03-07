import React from 'react';
import Nick from '../nick';

export default class Msg extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span className='msg'>
                <Nick nick={message.from} />&nbsp;
                {message.msg}
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
