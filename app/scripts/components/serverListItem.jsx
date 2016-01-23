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

        const serverLabel = <Link
            className='server'
            key={id}
            to={{ pathname: `/server/${id}` }}
            activeClassName='selected'>
            {client.name || client.opt.server}
        </Link>;

        const treeClass = classnames({
            server: true
        });

        return (
            <div className={treeClass}>
                <TreeView nodeLabel={serverLabel}>
                {
                    _.map(channels, (channel, name) => {
                        const url = `/server/${id}/channel/${encodeURIComponent(name)}`;

                        return <div key={name} className='channel' onContextMenu={this.loadContextMenu.bind(channel)}>
                            <Link
                                to={{ pathname: url }}
                                activeClassName='selected'>
                                {name}
                            </Link>
                        </div>;
                    })
                }
                </TreeView>
            </div>
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
