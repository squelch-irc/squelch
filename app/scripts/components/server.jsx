const React = require('react');

const Chat = require('./chat');
const Input = require('./input');
const checkPropsChanged = require('../util/checkPropsChanged');

class ServerView extends React.Component {
    shouldComponentUpdate(newProps) {
        return checkPropsChanged(
            this.props.server, newProps.server,
            'id', 'messages'
        );
    }

    render() {
        const { id, messages } = this.props.server;

        return (
            <div className='server-view pane-group'>
                <div className='io-container pane'>
                    <Chat messages={messages} />
                    <Input serverId={id} />
                </div>
            </div>
        );
    }
}

ServerView.propTypes = {
    server: React.PropTypes.shape({
        messages: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        id: React.PropTypes.string.isRequired
    }).isRequired
};

module.exports = ServerView;
