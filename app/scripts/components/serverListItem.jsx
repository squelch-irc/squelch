import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import TreeView from 'react-treeview';
import classnames from 'classnames';

const { Link } = Router;

export default class ServerListItem extends React.Component {

    sortedChannels() {
        return _.sortBy(this.props.server.channels());
    }

    render() {
        const serverParams = {
            serverId: this.props.server.id
        };

        const serverLabel = <Link
            className='server'
            key={this.props.server.id}
            to='server'
            params={serverParams}
            activeClassName='selected'>

            {this.props.server.name || this.props.server.opt.server}
        </Link>;

        // const href = this.props.routeStore.makePath('server', serverParams);
        const treeClass = classnames({
            server: true
            // selected: this.props.routeStore.isActive(href)
        });

        return (
            <div className={treeClass}>
                <TreeView nodeLabel={serverLabel}>
                {
                    _.map(this.sortedChannels(), (channel) => {
                        const params = {
                            serverId: this.props.server.id,
                            channel: encodeURIComponent(channel.name())
                        };

                        return <div key={channel.name()} className='channel'>
                            <Link
                                to='channel'
                                params={params}
                                activeClassName='selected'>

                                {channel.name()}
                            </Link>
                        </div>;
                    })
                }
                </TreeView>
            </div>
        );
    }
}
