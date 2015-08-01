import React from 'react';
import ServerListItem from './serverListItem';
import _ from 'lodash';
import ServerStore from '../stores/servers';
import {connectToStores} from 'fluxible-addons-react';

@connectToStores([ServerStore], context => context.getStore(ServerStore).getState())
export default class ServerList extends React.Component {

    render() {
        const servers = _.map(this.props.servers, (server) => {
            return <ServerListItem key={server.id} server={server}/>;
        });
        return (
            <div className='server-list'>{servers}</div>
        );
    }
}
