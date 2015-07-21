import React from 'react';
import _ from 'lodash';

export default class UserList extends React.Component {

    constructor() {
        super();
        this.state = {
            users: [
                {name: 'Seiyria', flag: '@'},
                {name: 'Darkblizer', flag: '%'},
                {name: 'Zesty', flag: '&'},
                {name: 'Kurea', flag: '~'},
                {name: 'KR', flag: '~'},
                {name: 'Freek', flag: ''},
                {name: 'Ergo', flag: '+'},
                {name: 'Darkbuizel', flag: '+'},
                {name: 'FalconCaptain', flag: '+'}
            ]
        };
    }

    sortedUsers() {
        const ranks = {
            '~': 5, // owner
            '&': 4, // admin
            '@': 3, // op
            '%': 2, // halfop
            '+': 1, // voice
            '': 0   // none
        };

        return _(this.state.users)
            .sortByOrder([(user) => {
                return ranks[user.flag];
            }, (user) => user.name.toLowerCase()], ['desc', 'asc'])
            .value();
    }

    render() {
        return (
            <div className='userlist-container'>
                <div className='userlist-title'>Users</div>
                <ul className='userlist'>
                {
                    _.map(this.sortedUsers(), (user) => {
                        return <li className='user' key={user.name}>
                            <span className='user-flag'>{user.flag}</span>
                            <span className='user-name'>{user.name}</span>
                        </li>;
                    })
                }
                </ul>
            </div>
        );
    }
}
