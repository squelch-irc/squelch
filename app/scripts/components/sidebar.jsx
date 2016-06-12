const React = require('react');
const ServerList = require('./serverList');

class Sidebar extends React.Component {

    render() {
        return (
            <div className='pane-sm sidebar'>
                <ServerList state={this.props.state}/>
            </div>
        );
    }
}

Sidebar.propTypes = {
    state: React.PropTypes.object.isRequired
};

module.exports = Sidebar;
