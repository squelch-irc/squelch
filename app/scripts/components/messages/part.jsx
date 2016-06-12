const React = require('react');
const Nick = require('../nick');

class Part extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='part'>
                ←&nbsp;<Nick nick={message.nick} />&nbsp;
                has left {message.chan}&nbsp;{message.reason ? '(' + message.reason + ')' : ''}
            </span>
        );
    }
}

Part.propTypes = {
    message: React.PropTypes.shape({
        nick: React.PropTypes.string.isRequired,
        chan: React.PropTypes.string.isRequired,
        reason: React.PropTypes.string
    }).isRequired
};

module.exports = Part;
