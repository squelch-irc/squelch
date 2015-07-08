import React from 'react';
import MainView from './views/root';
import LessLoader from 'less-hot';
import Squelch from './core/squelch';
import _ from 'lodash';

// Make Squelch global
window.Squelch = Squelch;

Squelch.config.read()
.then((config) => {
    _.each(config.servers, (serverConfig) => {
        if (serverConfig.autoConnect) {
            Squelch.serverManager.addServer(serverConfig);
        }
    });
})
.catch((err) => {
    alert('Something went wrong while trying to load your config\n\n' + (err.message || err));
    require('remote').process.exit(1);
})
.done();

React.render(
    <MainView />,
    document.getElementById('squelch-root')
);

// Load our less styles
var lessLoader = new LessLoader();
document.querySelector('head').appendChild(lessLoader('./app/less/app.less'));
