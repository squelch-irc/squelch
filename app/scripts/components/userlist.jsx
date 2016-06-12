const React = require('react');
const _ = require('lodash');
const hash = require('squelch-nick-hash');

const User = require('./user');

const RANK_ORDER = {
    '~': 5, // owner
    '&': 4, // admin
    '@': 3, // op
    '%': 2, // halfop
    '+': 1, // voice
    '': 0   // none
};

class UserList extends React.Component {
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
        .orderBy(['rank', 'nickLowercase'], ['desc', 'asc'])
        .value();
    }

    render() {

        return (
            <div className='userlist pane pane-sm sidebar'>
                <div className='nav-group'>
                    <h5 className='nav-group-title'>Users</h5>
                    {
                        this.sortedUsers().map((user) => {
                            const userClass = `nav-group-item user nick-color-${hash(user.nick)}`;
                            return <a href='' className={userClass} key={user.nick}>
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

module.exports = UserList;
