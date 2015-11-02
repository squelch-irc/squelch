import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import pureRender from 'pure-render-decorator';

import ServerStore from '../stores/servers';

import ServerListItem from './serverListItem';

@connectToStores
@pureRender
export default class ServerList extends React.Component {
    static getStores() { return [ServerStore]; }
    static getPropsFromStores() { return ServerStore.getState(); }

    render() {
        const servers = this.props.servers.map((server) => {
            return <ServerListItem key={server.id} server={server}/>;
        });

        return (
            <div className='server-list'>{servers}</div>
        );
    }
}
