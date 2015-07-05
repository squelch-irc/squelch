import React from 'react';
import TreeView from 'react-treeview';

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

    render() {
        var serverLabel = <span>{this.state.name}</span>;
        return (
            <TreeView className='server' nodeLabel={serverLabel}>
            {
                this.state.channels.map((channel) => {
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
