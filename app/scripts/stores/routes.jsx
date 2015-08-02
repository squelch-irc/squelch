import {RouteStore} from 'fluxible-router';

import ServerView from '../components/server';
import ChannelView from '../components/channel';
import WelcomeView from '../components/welcome';

const routes = {
    server: {
        method: 'GET',
        path: '/server/:serverId',
        handler: ServerView
    },
    channel: {
        method: 'GET',
        path: '/server/:serverId/channel/:channel',
        handler: ChannelView
    },
    welcome: {
        method: 'GET',
        path: '/',
        handler: WelcomeView
    }
};

const SquelchRouteStore = RouteStore.withStaticRoutes(routes);

export default SquelchRouteStore;
