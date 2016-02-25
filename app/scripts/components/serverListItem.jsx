import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import TreeView from 'react-treeview';
import classnames from 'classnames';
import MenuHandler from '../../core/menuHandler';

export default class ServerListItem extends React.Component {

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
        const { id, channels, connected } = server;
        const client = server.getClient();

        const currentServerId = this.props.state.route.params.serverId;
        const currentChannel = this.props.state.route.params.channel;

        const serverActiveClass = classnames({
            'nav-group-item': true,
            server: true,
            active: currentServerId === id && !currentChannel,
            connected
        });

        const treeItemClass = classnames({
            active: currentServerId === id && !currentChannel
        })

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
                        active: currentServerId === id && currentChannel === name,
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
            </TreeView>
        );
    }
}
ServerListItem.propTypes = {
    state: React.PropTypes.shape({
        server: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            channels: React.PropTypes.objectOf(React.PropTypes.object).isRequired
        })
    })
};
