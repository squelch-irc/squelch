import path from 'path';
import React from 'react';
import Router from 'react-router';
import LessLoader from 'less-hot';

import ConfigActions from './actions/config';

import routes from './routes';

// Load our less styles
const lessLoader = new LessLoader();
document.querySelector('head').appendChild(lessLoader(path.join(__dirname, '../less/app.less')));

ConfigActions.load();

Router.run(routes, (Root) => {
    React.render(<Root />, document.getElementById('squelch-root'));
});
