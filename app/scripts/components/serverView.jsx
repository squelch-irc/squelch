import React from 'react';
import TreeView from 'react-treeview';
import _ from 'lodash';

export default class ServerView extends React.Component {

    constructor(props) {
        super(props);
    }

    sortedChannels() {
        return _.sortBy(this.props.server.channels());
    }

    render() {
        var serverLabel = <span>{this.props.server.name || this.props.server.opt.server}</span>;
        return (
            <TreeView className='server' nodeLabel={serverLabel}>
            {
                _.map(this.sortedChannels(), (channel) => {
                    return <div className='channel' key={channel.name()}>{ channel.name() }</div>;
                })
            }
            </TreeView>
        );
    }
};
