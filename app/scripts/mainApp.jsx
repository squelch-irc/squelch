import React from 'react';
import {View} from './views/root.js';
import LessLoader from 'less-hot';
import Squelch from './core/squelch'

// Make Squelch global
window.Squelch = Squelch;

Squelch.config.read()
.then((config) => {
    config.servers.forEach((serverConfig) => {
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
    <View />,
    document.getElementById('squelch-root')
);

// Load our less styles
var lessLoader = new LessLoader();
document.querySelector('head').appendChild(lessLoader('./app/less/app.less'));
