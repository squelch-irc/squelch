import React from 'react';

import Sidebar from './sidebar';

export default class SquelchView extends React.Component {
    render() {
        return (
            <div id='squelch-view'>
                <Sidebar />
                <div className='main-view'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
