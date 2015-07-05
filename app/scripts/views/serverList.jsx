import React from 'react';
import ServerView from './server'

export default class ServerList extends React.Component {

    constructor() {
        super();
        this.state = {
            servers: Squelch.serverManager.getServers()
        };
        this.updateServers = this.updateServers.bind(this);
    }

    render() {
        return (
            <div className='server-list'>
                {
                    this.state.servers.map((server) => {
                        return <ServerView key={server.id} serverId={server.id}/>;
                    })
                }
            </div>
        );
    }

    updateServers(client) {
        this.setState({
            servers: Squelch.serverManager.getServers()
        });
    }

    componentDidMount() {
        Squelch.serverManager.on('addServer', this.updateServers);
        Squelch.serverManager.on('removeServer', this.updateServers);
    }

    componentWillUnmount() {
        Squelch.serverManager.off('addServer', this.updateServers);
        Squelch.serverManager.off('removeServer', this.updateServers);
    }
};
