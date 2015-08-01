import React from 'react';
import TreeView from 'react-treeview';
import classnames from 'classnames';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import _ from 'lodash';

import RouteStore from '../stores/routes';

@connectToStores([RouteStore], (context) => ({
    routeStore: context.getStore(RouteStore)
}))
export default class ServerListItem extends React.Component {

    sortedChannels() {
        return _.sortBy(this.props.server.channels());
    }

    render() {
        const serverParams = {
            serverId: this.props.server.id
        };
        const serverLabel = <NavLink
            className='server'
            key={this.props.server.id}
            routeName='server'
            navParams={serverParams}
            activeClass='selected'>
            {this.props.server.name || this.props.server.opt.server}
        </NavLink>;
        const href = this.props.routeStore.makePath('server', serverParams);
        const treeClass = classnames({
            server: true,
            selected: this.props.routeStore.isActive(href)
        });
        return (
            <div className={treeClass}>
                <TreeView nodeLabel={serverLabel}>
                {
                    _.map(this.sortedChannels(), (channel) => {
                        const params = {
                            serverId: this.props.server.id,
                            channel: channel.name()
                        };
                        return <div className='channel'><NavLink
                            key={channel.name()}
                            routeName='channel'
                            navParams={params}
                            activeClass='selected'>
                            {channel.name()}
                        </NavLink></div>;
                    })
                }
                </TreeView>
            </div>
        );
    }
}
