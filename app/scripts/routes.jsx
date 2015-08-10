import React from 'react';
import Router from 'react-router';

import SquelchView from './components/squelchView';
import WelcomeView from './components/welcome';
import ServerView from './components/server';
import ChannelView from './components/channel';

const { Route, DefaultRoute } = Router;

export default (
    <Route handler={SquelchView}>
        <DefaultRoute handler={WelcomeView} />

        <Route name="server" path="server/:serverId" handler={ServerView} />
        <Route name="channel" path="server/:serverId/channel/:channel" handler={ChannelView} />
    </Route>
);
