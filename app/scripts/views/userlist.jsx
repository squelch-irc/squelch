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
                {name: 'Darkbuizel', flag: '+'}
            ]
        };
    }

    sortedUsers() {
        var ranks = {
            '~': 5, // owner
            '&': 4, // admin
            '@': 3, // op
            '%': 2, // halfop
            '+': 1, // voice
            '': 0   // none
        };

        var x = _(this.state.users)
            .sortBy((user) => {
                return ranks[user.flag];
            })
            .reverse()
            .value();

        console.log(JSON.stringify(x));
        return x;
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
};
