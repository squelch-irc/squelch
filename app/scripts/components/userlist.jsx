import React from 'react';
import _ from 'lodash';

import User from './user';

const RANK_ORDER = {
    '~': 5, // owner
    '&': 4, // admin
    '@': 3, // op
    '%': 2, // halfop
    '+': 1, // voice
    '': 0   // none
};

export default class UserList extends React.Component {
    shouldComponentUpdate(newProps) {
        return this.props.users !== newProps.users;
    }

    sortedUsers() {
        return _(this.props.users)
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
            <div className='userlist pane pane-sm sidebar'>
                <div className='nav-group'>
                    <h5 className='nav-group-title'>Users</h5>
                    {
                        this.sortedUsers().map((user) => {
                            return <a href='' className='nav-group-item user' key={user.nick}>
                                <User nick={user.nick} status={user.status} />
                            </a>;
                        })
                    }
                </div>
            </div>
        );
    }
}

UserList.propTypes = {
    users: React.PropTypes.objectOf(
        React.PropTypes.shape({
            status: React.PropTypes.string.isRequired
        })
    ).isRequired
};
