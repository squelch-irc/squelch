const React = require('react');

class Raw324 extends React.Component {
    render() {
        const chan = this.props.message.params[1];
        const mode = this.props.message.params.slice(2);

        return (
            <span className='message-info mode-is'>
                Mode for {chan} is <span className='mode'>{mode.join(' ')}</span>
            </span>
        );
    }
}

Raw324.propTypes = {
    message: React.PropTypes.shape({
        params: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    }).isRequired
};

module.exports = Raw324;
