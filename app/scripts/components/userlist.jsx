import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import pureRender from 'pure-render-decorator';

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
@pureRender
export default class UserList extends React.Component {
    static getStores() { return [ServerStore]; }
    static getPropsFromStores() { return ServerStore.getState(); }

    sortedUsers() {
        const { servers, serverId, channel } = this.props;

        const users = servers.getIn([serverId, 'channels', channel, 'users']);
        return users.sortBy((user, nick) => {
            return { nick, rank: RANK_ORDER[user.status] };
        }, (a, b) => {
            if(a.rank !== b.rank) return b.rank - a.rank;
            return a.nick.localeCompare(b.nick);
        });
    }

    render() {

        return (
            <div className='userlist-container'>
                <div className='userlist-title'>Users</div>
                <ul className='userlist'>
                {
                    this.sortedUsers().map((user, nick) => {
                        return <li className='user' key={nick}>
                            <span className='user-flag'>{user.status}</span>
                            <span className='user-name'>{nick}</span>
                        </li>;
                    })
                }
                </ul>
            </div>
        );
    }
}
