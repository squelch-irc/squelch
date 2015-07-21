import React from 'react';
import ServerView from './serverView';
import _ from 'lodash';
import ServerStore from '../stores/servers';
import {connectToStores} from 'fluxible-addons-react';

@connectToStores([ServerStore], (context) => context.getStore(ServerStore).getState())
export default class ServerList extends React.Component {

    constructor() {
        super();
    }

    render() {
        const servers = _.map(this.props.servers, (server) => {
            return <ServerView key={server.id} server={server}/>;
        });
        return (
            <div className='server-list'>{servers}</div>
        );
    }
}
