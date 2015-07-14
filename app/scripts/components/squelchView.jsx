import React from 'react';
import ChannelView from './channel';
import Sidebar from './sidebar';

export default class SquelchView extends React.Component {
    render() {
        return (
            <div id='main-view'>
                <Sidebar /><ChannelView />
            </div>
        );
    }
};
