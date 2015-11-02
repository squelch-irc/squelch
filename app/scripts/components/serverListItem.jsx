import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import TreeView from 'react-treeview';
import classnames from 'classnames';
import pureRender from 'pure-render-decorator';

@pureRender
export default class ServerListItem extends React.Component {

    sortedChannels() {
        return _.sortBy(this.props.server._channels);
    }

    render() {
        const { client, channels } = this.props.server;

        const serverLabel = <Link
            className='server'
            key={client.id}
            to={`/server/${client.id}`}
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
                    channels.map((channel, name) => {
                        const url = `/server/${client.id}/channel/${encodeURIComponent(name)}`;

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
