import path from 'path';
import React from 'react';
import LessLoader from 'less-hot';

import Fluxible from 'fluxible';
import FluxibleComponent from 'fluxible-addons-react/FluxibleComponent';
import {navigateAction} from 'fluxible-router';

import ServerStore from './stores/servers';
import ConfigStore from './stores/config';
import MessageStore from './stores/messages';
import RouteStore from './stores/routes';
import SquelchView from './components/squelchView';
import {ConfigLoadAction} from './actions/config';

// Load our less styles
const lessLoader = new LessLoader();
document.querySelector('head').appendChild(lessLoader(path.join(__dirname, '../less/app.less')));


const app = new Fluxible({
    stores: [
        RouteStore,
        ServerStore,
        ConfigStore,
        MessageStore
    ]
});

const context = app.createContext();
context.executeAction(navigateAction, {url: '/'}).then(() => {
    return context.executeAction(ConfigLoadAction);
}).then(() => {
    React.render(
        <FluxibleComponent context={context.getComponentContext()}>
            <SquelchView />
        </FluxibleComponent>,
        document.getElementById('squelch-root')
    );
});

export default app;
