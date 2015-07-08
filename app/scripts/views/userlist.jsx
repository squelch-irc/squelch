import React from 'react';
import _ from 'lodash';

export default class UserList extends React.Component {

    constructor() {
        super();
        this.state = {
            users: [
                {name: 'Seiyria', flag: '@'},
                {name: 'KR', flag: '~'},
                {name: 'Freek', flag: ''},
                {name: 'Darkbuizel', flag: '+'}
            ]
        };
    }

    render() {
        return (
            <div className='userlist-container'>
                <div className='userlist-title'>Users</div>
                <ul className='userlist'>
                {
                    _.map(this.state.users, (user) => {
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
