const React = require('react');
const Nick = require('../nick');

class Notice extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='notice'>
                &raquo;&nbsp;<Nick nick={message.from} appendText=':' />&nbsp;
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

module.exports = Notice;
