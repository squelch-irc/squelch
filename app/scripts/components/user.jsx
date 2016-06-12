const React = require('react');
const MenuHandler = require('../../core/menuHandler');

class User extends React.Component {

    loadContextMenu(e) {
        e.preventDefault();
        MenuHandler.loadUserContextMenu(this);
    }

    render() {
        return (
            <div onContextMenu={this.loadContextMenu.bind(this.props)}>
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
