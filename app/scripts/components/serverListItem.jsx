const _ = require('lodash');
const React = require('react');
const { Link } = require('react-router');
const TreeView = require('react-treeview');
const classnames = require('classnames');

const checkPropsChanged = require('../util/checkPropsChanged');

class ServerListItem extends React.Component {

    shouldComponentUpdate(newProps) {
        return checkPropsChanged(this.props, newProps, 'server', 'routeParams');
    }

    render() {
        const { server, routeParams } = this.props;
        const { id, channels, userMessages, connected } = server;
        const client = server.getClient();

        const serverActiveClass = classnames({
            'nav-group-item': true,
            server: true,
            active: routeParams.serverId === id && !routeParams.channel,
            connected
        });

        const treeItemClass = classnames({
            active: routeParams.serverId === id && !routeParams.channel,
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
                        active: routeParams.serverId === id && routeParams.channel === name,
                        joined: channel.joined
                    });
                    return <Link
                        className={channelLabelClass}
                        key={name}
                        to={{ pathname: url }}>
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
                        active: routeParams.serverId === id && routeParams.user === user
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
    server: React.PropTypes.shape({
        id: React.PropTypes.string,
        channels: React.PropTypes.object,
        userMessages: React.PropTypes.object,
        connected: React.PropTypes.bool
    }).isRequired,
    routeParams: React.PropTypes.shape({
        serverId: React.PropTypes.string,
        channel: React.PropTypes.string,
        user: React.PropTypes.string
    }).isRequired
};

module.exports = ServerListItem;
