const React = require('react');
const _ = require('lodash');

const ServerListItem = require('./serverListItem');
const checkPropsChanged = require('../util/checkPropsChanged');

class ServerList extends React.Component {

    shouldComponentUpdate(newProps) {
        return checkPropsChanged(this.props, newProps, 'servers', 'routeParams');
    }

    render() {
        const { servers, routeParams } = this.props;
        const serverListItems = _.map(servers, (server) =>
            <ServerListItem key={server.id} server={server} routeParams={routeParams}/>
        );

        return (
            <nav className='nav-group'>
                <h5 className="nav-group-title">Servers</h5>
                {serverListItems}
            </nav>
        );
    }
}

ServerList.propTypes = {
    servers: React.PropTypes.object.isRequired,
    routeParams: React.PropTypes.object.isRequired
};

module.exports = ServerList;
