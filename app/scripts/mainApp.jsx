import React from 'react';
import SquelchView from './components/squelchView';
import LessLoader from 'less-hot';
import _ from 'lodash';

import Fluxible from 'fluxible';
import FluxibleComponent from 'fluxible-addons-react/FluxibleComponent';
import {RouteStore, navigateAction} from 'fluxible-router';

import ServerStore from './stores/servers';
import ConfigStore from './stores/config';
import MessageStore from './stores/messages';
import routes from './configs/routes';

import {ConfigLoadAction} from './actions/config'

// Load our less styles
let lessLoader = new LessLoader();
document.querySelector('head').appendChild(lessLoader('./app/less/app.less'));

let SquelchRouteStore = RouteStore.withStaticRoutes(routes);

let app = new Fluxible({
    stores: [
        SquelchRouteStore,
        ServerStore,
        ConfigStore,
        MessageStore
    ]
});

let context = app.createContext();
context.executeAction(navigateAction, {url: '/'}).then(result => {
    return context.executeAction(ConfigLoadAction);
}).then(result => {
    React.render(
        <FluxibleComponent context={context.getComponentContext()}>
            <SquelchView />
        </FluxibleComponent>,
        document.getElementById('squelch-root')
    );
});

export default app;
