import React from 'react';

export class Sidebar extends React.Component {

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
                <ul id='channel-list'>
                {
                    this.state.channels.map((channel) => {
                        return <li>{channel.name}</li>;
                    })
                }
                </ul>
            </div>
        );
    }
};
