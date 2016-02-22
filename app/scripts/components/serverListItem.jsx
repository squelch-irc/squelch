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
        const { id, channels } = server;
        const client = server.getClient();

        const currentServerId = this.props.state.route.params.serverId;
        const currentChannel = this.props.state.route.params.channel;

        const serverActiveClass = classnames({
            active: currentServerId === id && !currentChannel
        });

        const serverLabel = <Link
            className={'nav-group-item ' + serverActiveClass}
            key={id}
            to={{ pathname: `/server/${id}` }}>
            {client.name || client.opt.server}
        </Link>;

        return (
            <TreeView nodeLabel={serverLabel} itemClassName={serverActiveClass}>
            {
                _.map(channels, (channel, name) => {
                    const url = `/server/${id}/channel/${encodeURIComponent(name)}`;
                    const channelLabelClass = classnames({
                        'nav-group-item': true,
                        active: currentServerId === id && currentChannel === name
                    });
                    return <div key={name} className={channelLabelClass} onContextMenu={this.loadContextMenu.bind(channel)}>
                        <Link
                            className={channelLabelClass}
                            key={name}
                            to={{ pathname: url }}>
                            {name}
                        </Link>
                    </div>;
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
