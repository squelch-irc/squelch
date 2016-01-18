import React from 'react';
import ServerList from './serverList';

export default class Sidebar extends React.Component {

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
