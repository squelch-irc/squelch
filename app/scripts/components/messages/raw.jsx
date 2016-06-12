const React = require('react');

class Raw extends React.Component {
    render() {
        const message = this.props.message;

        return <span className='raw message-info'>
            {message.params.slice(1).join(' ')}
        </span>;
    }
}

Raw.propTypes = {
    message: React.PropTypes.shape({
        params: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    }).isRequired
};

module.exports = Raw;
