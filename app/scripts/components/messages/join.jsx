const React = require('react');
const Nick = require('../nick');

class Join extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='join'>
                →&nbsp;<Nick nick={message.nick} />
                &nbsp;has joined {message.chan}
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

module.exports = Join;
