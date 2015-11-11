import React from 'react';

export default class Notice extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>
                &raquo;&nbsp;&lt;<span className='sender notice'>{message.from}</span>&gt;&nbsp;
                <span className='sender-message notice-message'>{message.msg}</span>
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
