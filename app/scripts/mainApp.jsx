import React from 'react';
import {View} from './views/root.js';
import LessLoader from 'less-hot';
import Squelch from './core/squelch'

// Make Squelch global
window.Squelch = Squelch;

Squelch.config.read()
.then(() => {
    // Render view after loading the config
    React.render(
        <View />,
        document.getElementById('squelch-root')
    );
});

// Load our less styles
var lessLoader = new LessLoader();
document.querySelector('head').appendChild(lessLoader('./app/less/app.less'));
