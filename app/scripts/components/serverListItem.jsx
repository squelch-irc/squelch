import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import TreeView from 'react-treeview';
import classnames from 'classnames';

export default class ServerListItem extends React.Component {

    sortedChannels() {
        return _.sortBy(this.props.server._channels);
    }

    render() {
        const { id, channels } = this.props.server;
        const client = this.props.server.getClient();

        const serverLabel = <Link
            className='server'
            key={id}
            to={`/server/${id}`}
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

                        return <div key={name} className='channel'>
                            <Link
                                to={url}
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
