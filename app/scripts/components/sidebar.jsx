import React from 'react';
import ServerList from './serverList';

export default class Sidebar extends React.Component {

    render() {
        return (
            <div id='sidebar'>
                <div className='sidebar-title'>Servers</div>
                <ServerList state={this.props.state}/>
            </div>
        );
    }
}

Sidebar.propTypes = {
    state: React.PropTypes.object.isRequired
};
