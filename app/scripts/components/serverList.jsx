import _ from 'lodash';
import React from 'react';
import connectToStores from 'alt/utils/connectToStores';

import ServerStore from '../stores/servers';

import ServerListItem from './serverListItem';

@connectToStores
export default class ServerList extends React.Component {
    static getStores() { return [ServerStore]; }
    static getPropsFromStores() { return ServerStore.getState(); }

    render() {
        const servers = _.map(this.props.servers, (server) => {
            return <ServerListItem key={server.id} server={server}/>;
        });

        return (
            <div className='server-list'>{servers}</div>
        );
    }
}
