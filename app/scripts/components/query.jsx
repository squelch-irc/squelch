const React = require('react');

const Chat = require('./chat');
const Input = require('./input');

class QueryView extends React.Component {
    shouldComponentUpdate(newProps) {

        const oldMessages = this.props.state.servers[this.props.params.serverId]
            .userMessages[this.props.params.user];
        const newMessages = newProps.state.servers[newProps.params.serverId]
            .userMessages[newProps.params.user];
        return oldMessages !== newMessages;
    }

    render() {
        const { serverId, user } = this.props.params;
        const messages = this.props.state.servers[serverId].userMessages[user];

        return (
            <div className='server-view pane-group'>
                <div className='io-container pane'>
                    <Chat messages={messages} />
                    <Input serverId={serverId} target={user}/>
                </div>
            </div>
        );
    }
}

QueryView.propTypes = {
    state: React.PropTypes.object.isRequired,
    params: React.PropTypes.shape({
        serverId: React.PropTypes.string.isRequired,
        user: React.PropTypes.string.isRequired
    }).isRequired
};

module.exports = QueryView;
