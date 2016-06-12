import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory }  from 'react-router';

import State from './stores/state';

import './reactions/config';
import './reactions/route';
import './reactions/message';
import './reactions/server';
import './reactions/theme';

import SquelchView from './components/squelchView';
import WelcomeView from './components/welcome';
import ServerView from './components/server';
import ChannelView from './components/channel';
import QueryView from './components/query';

import Squelch from './core/squelchGlobal';
import corePkg from './core/corePackage';

window.Squelch = Squelch;

// Hardcode load core package
Squelch.packages.loadPackage('core', corePkg);

State.trigger('config:load');

const onUpdate = function() {
    State.trigger('route:update', this.state);
};

ReactDOM.render(
    <Router history={hashHistory} onUpdate={onUpdate}>
        <Route path="/" component={SquelchView}>
            <IndexRoute component={WelcomeView} />
            <Route path="server/:serverId" component={ServerView} />
            <Route path="server/:serverId/channel/:channel" component={ChannelView} />
             <Route path="server/:serverId/user/:user" component={QueryView} />
        </Route>
    </Router>
, document.getElementById('squelch-root'));
