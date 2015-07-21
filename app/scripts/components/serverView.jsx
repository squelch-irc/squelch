import React from 'react';
import TreeView from 'react-treeview';
import {NavLink} from 'fluxible-router';
import _ from 'lodash';

export default class ServerView extends React.Component {

    constructor(props) {
        super(props);
    }

    sortedChannels() {
        return _.sortBy(this.props.server.channels());
    }

    render() {
        const serverLabel = <span>{this.props.server.name || this.props.server.opt.server}</span>;
        return (
            <TreeView className='server' nodeLabel={serverLabel}>
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
        );
    }
}
