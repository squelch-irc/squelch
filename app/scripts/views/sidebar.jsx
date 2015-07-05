import React from 'react';
import ServerList from './serverList'

export default class Sidebar extends React.Component {

    constructor() {
        super();
        this.state = {
            channels: [
                {name: '#kellyirc'},
                {name: '#dgr'},
                {name: '#coders'},
                {name: '#Furry'}
            ]
        };
    }

    render() {
        return (
            <div id='sidebar'>
                <div className='sidebar-title'>Servers</div>
                <ServerList />
            </div>
        );
    }
};
