import React from 'react';
import ServerList from './serverList';
import pureRender from 'pure-render-decorator';

@pureRender
export default class Sidebar extends React.Component {

    render() {
        return (
            <div id='sidebar'>
                <div className='sidebar-title'>Servers</div>
                <ServerList />
            </div>
        );
    }
}
