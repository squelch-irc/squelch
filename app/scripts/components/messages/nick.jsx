const React = require('react');
const Nick = require('../nick');

class NickMsg extends React.Component {
    render() {
        const message = this.props.message;

        if(message.me) {
            return (
                <span className='nick-change'>
                    You are now known as&nbsp;
                    <Nick nick={message.newNick} className='new-nick' />
                </span>
            );

        }

        return (
            <span className='nick-change'>
                <Nick nick={message.oldNick} className='old-nick' />
                &nbsp;is now known as&nbsp;
                <Nick nick={message.newNick} className='new-nick' />
            </span>
        );
    }
}

NickMsg.propTypes = {
    message: React.PropTypes.shape({
        oldNick: React.PropTypes.string.isRequired,
        newNick: React.PropTypes.string.isRequired
    }).isRequired
};

module.exports = NickMsg;
