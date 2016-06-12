const React = require('react');
const _ = require('lodash');

const ServerListItem = require('./serverListItem');

class ServerList extends React.Component {

    shouldComponentUpdate(newProps) {
        const { state } = this.props;
        const newState = newProps.state;
        return state.servers !== newState.servers ||
            state.route !== newState.route;
    }

    render() {
        const servers = _.map(this.props.state.servers, (server) =>
            <ServerListItem key={server.id} serverId={server.id} state={this.props.state}/>
        );

        return (
            <nav className='nav-group'>
                <h5 className="nav-group-title">Servers</h5>
                {servers}
            </nav>
        );
    }
}

ServerList.propTypes = {
    state: React.PropTypes.object.isRequired
};

module.exports = ServerList;
