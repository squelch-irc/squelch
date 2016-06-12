const React = require('react');

class Error extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='message-error'>
                Error: {message.params.join(' ')}
            </span>
        );
    }
}

Error.propTypes = {
    message: React.PropTypes.shape({
        params: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    }).isRequired
};

module.exports = Error;
