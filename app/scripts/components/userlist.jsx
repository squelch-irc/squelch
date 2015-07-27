import React from 'react';
import _ from 'lodash';
import {connectToStores} from 'fluxible-addons-react';

import ServerStore from '../stores/servers';

const RANK_ORDER = {
    '~': 5, // owner
    '&': 4, // admin
    '@': 3, // op
    '%': 2, // halfop
    '+': 1, // voice
    '': 0   // none
};

@connectToStores([ServerStore], context => context.getStore(ServerStore).getState())
export default class UserList extends React.Component {

    sortedUsers() {
        const {servers, serverId, channel} = this.props;
        const serverChannel = servers[serverId].getChannel(channel);
        return _(serverChannel.users())
            .map((nick) => ({
                nick,
                flag: serverChannel.getStatus(nick),
                flagRank: RANK_ORDER[serverChannel.getStatus(nick)]
            }))
            .sortByOrder(['flagRank', 'nick'], ['desc', 'asc'])
            .value();
    }

    render() {
        return (
            <div className='userlist-container'>
                <div className='userlist-title'>Users</div>
                <ul className='userlist'>
                {
                    _.map(this.sortedUsers(), (user) => {
                        return <li className='user' key={user.nick}>
                            <span className='user-flag'>{user.flag}</span>
                            <span className='user-name'>{user.nick}</span>
                        </li>;
                    })
                }
                </ul>
            </div>
        );
    }
}
