import React from 'react';
import Nick from '../nick';

export default class Notice extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='notice'>
                &raquo;&nbsp;&lt;<Nick nick={message.from} />&gt;&nbsp;
                {message.msg}
            </span>
        );
    }
}

Notice.propTypes = {
    message: React.PropTypes.shape({
        from: React.PropTypes.string.isRequired,
        msg: React.PropTypes.string.isRequired
    }).isRequired
};
