const React = require('react');

const checkPropsChanged = require('../util/checkPropsChanged');

class User extends React.Component {

    shouldComponentUpdate(newProps) {
        return checkPropsChanged(this.props, newProps, 'status', 'nick');
    }

    render() {
        return (
            <div>
                <span className='user-flag'>{this.props.status}</span>
                <span className='user-name'>{this.props.nick}</span>
            </div>
        );
    }
}

User.propTypes = {
    status: React.PropTypes.string,
    nick: React.PropTypes.string
};

module.exports = User;
