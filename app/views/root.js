import React from 'react';
import {ChannelView} from './channel.js';
import {Sidebar} from './sidebar.js';

export class View extends React.Component {
  render() {
    return (
      <div id="main-view">
      <Sidebar /><ChannelView />
      </div>
    );
  }
};
