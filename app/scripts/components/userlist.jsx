import React from 'react';
import _ from 'lodash';
import connectToStores from 'alt/utils/connectToStores';

import ServerStore from '../stores/servers';

const RANK_ORDER = {
    '~': 5, // owner
    '&': 4, // admin
    '@': 3, // op
    '%': 2, // halfop
    '+': 1, // voice
    '': 0   // none
};

@connectToStores
export default class UserList extends React.Component {
    static getStores() { return [ServerStore]; }
    static getPropsFromStores() { return ServerStore.getState(); }

    sortedUsers() {
        const { servers, serverId, channel } = this.props;
        return _(servers[serverId].channels[channel].users)
        .map((user, nick) => ({
            nick,
            nickLowercase: nick.toLowerCase(),
            status: user.status,
            rank: RANK_ORDER[user.status]
        }))
        .sortByOrder(['rank', 'nickLowercase'], ['desc', 'asc'])
        .value();
    }

    render() {

        return (
            <div className='userlist-container'>
                <div className='userlist-title'>Users</div>
                <ul className='userlist'>
                {
                    this.sortedUsers().map((user) => {
                        return <li className='user' key={user.nick}>
                            <span className='user-flag'>{user.status}</span>
                            <span className='user-name'>{user.nick}</span>
                        </li>;
                    })
                }
                </ul>
            </div>
        );
    }
}
