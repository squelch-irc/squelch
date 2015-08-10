import _ from 'lodash';
import React from 'react';
import Router from 'react-router';

import Sidebar from './sidebar';

const { RouteHandler } = Router;

export default class SquelchView extends React.Component {
    render() {
        return (
            <div id='squelch-view'>
                <Sidebar />
                <div className='main-view'>
                    <RouteHandler />
                </div>
            </div>
        );
    }
}
