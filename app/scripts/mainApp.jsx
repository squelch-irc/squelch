import React from 'react';
import SquelchView from './components/squelchView';
import LessLoader from 'less-hot';
import _ from 'lodash';

import Fluxible from 'fluxible';
import FluxibleComponent from 'fluxible-addons-react/FluxibleComponent';

import ServerStore from './stores/servers';
import ConfigStore from './stores/config';

import {ConfigLoadAction} from './actions/config.jsx'

// Load our less styles
var lessLoader = new LessLoader();
document.querySelector('head').appendChild(lessLoader('./app/less/app.less'));

let app = new Fluxible({
    stores: [
        ServerStore,
        ConfigStore
    ]
});

let context = app.createContext();
context.executeAction(ConfigLoadAction);

React.render(
    <FluxibleComponent context={context.getComponentContext()}>
        <SquelchView />
    </FluxibleComponent>,
    document.getElementById('squelch-root')
);

export default app;
