const React = require('react');
const Nick = require('../nick');

class Msg extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span className='msg'>
                <Nick nick={message.from} appendText=':'/>&nbsp;
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

module.exports = Msg;
