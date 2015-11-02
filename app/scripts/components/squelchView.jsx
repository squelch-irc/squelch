import React from 'react';
import pureRender from 'pure-render-decorator';

import Sidebar from './sidebar';

@pureRender
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
