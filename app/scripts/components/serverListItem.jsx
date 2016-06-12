const _ = require('lodash');
const React = require('react');
const { Link } = require('react-router');
const TreeView = require('react-treeview');
const classnames = require('classnames');
const MenuHandler = require('../../core/menuHandler');

class ServerListItem extends React.Component {

    shouldComponentUpdate(newProps) {
        const { state } = this.props;
        const newState = newProps.state;
        return state.servers !== newState.servers ||
            state.route !== newState.route;
    }

    getServer() {
        const { state, serverId } = this.props;
        return state.servers[serverId];
    }

    loadContextMenu(e) {
        e.preventDefault();
        MenuHandler.loadChannelContextMenu(this);
    }

    render() {
        const server = this.getServer();
        const { id, channels, userMessages, connected } = server;
        const client = server.getClient();

        const current = this.props.state.route.params;

        const serverActiveClass = classnames({
            'nav-group-item': true,
            server: true,
            active: current.serverId === id && !current.channel,
            connected
        });

        const treeItemClass = classnames({
            active: current.serverId === id && !current.channel,
            connected
        });

        const serverLabel = <Link
            className={serverActiveClass}
            key={id}
            to={{ pathname: `/server/${id}` }}>
            {client.name || client.opt.server}
        </Link>;

        return (
            <TreeView nodeLabel={serverLabel} itemClassName={treeItemClass}>
            {
                _.map(channels, (channel, name) => {
                    const url = `/server/${id}/channel/${encodeURIComponent(name)}`;
                    const channelLabelClass = classnames({
                        'nav-group-item': true,
                        channel: true,
                        active: current.serverId === id && current.channel === name,
                        joined: channel.joined
                    });
                    return <Link
                        className={channelLabelClass}
                        key={name}
                        to={{ pathname: url }}
                        onContextMenu={this.loadContextMenu.bind(channel)}>
                        {name}
                    </Link>;
                })
            }
            {
                _.map(userMessages, (messages, user) => {
                    const url = `/server/${id}/user/${encodeURIComponent(user)}`;
                    const userLabelClass = classnames({
                        'nav-group-item': true,
                        user: true,
                        active: current.serverId === id && current.user === user
                    });
                    return <Link
                        className={userLabelClass}
                        key={user}
                        to={{ pathname: url }}>
                        {user}
                    </Link>;
                })
            }
            </TreeView>
        );
    }
}
ServerListItem.propTypes = {
    state: React.PropTypes.shape({
        servers: React.PropTypes.object.isRequired,
        route: React.PropTypes.shape({
            params: React.PropTypes.object
        }).isRequired
    }),
    serverId: React.PropTypes.string.isRequired
};

module.exports = ServerListItem;
