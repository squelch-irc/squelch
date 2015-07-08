import React from 'react';
import TreeView from 'react-treeview';
import _ from 'lodash';

export default class ServerView extends React.Component {

    constructor(props) {
        super(props);
        this.server = Squelch.serverManager.getServer(props.serverId);
        this.state = {
            name: this.server.name || this.server.opt.server,
            channels: this.server.channels()
        };
        this.updateChannels = this.updateChannels.bind(this);
    }

    sortedChannels() {
        return _.sortBy(this.state.channels);
    }

    render() {
        var serverLabel = <span>{this.state.name}</span>;
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

    updateChannels(e) {
        if (e.nick === this.server.nick()) {
            this.setState({
                channels: this.server.channels()
            });
        }
    }

    componentDidMount() {
        this.server.on('join', this.updateChannels);
        this.server.on('part', this.updateChannels);
        this.server.on('kick', this.updateChannels);
    }

    componentWillUnmount() {
        this.server.off('join', this.updateChannels);
        this.server.off('part', this.updateChannels);
        this.server.off('kick', this.updateChannels);
    }
};
