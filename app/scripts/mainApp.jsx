import React from 'react';
import {View} from './views/root.js';
import LessLoader from 'less-hot';

// Load our less styles
var lessLoader = new LessLoader();
document.querySelector('head').appendChild(lessLoader('./app/less/app.less'));

React.render(
	<View />,
	document.getElementById('squelch-root')
);
