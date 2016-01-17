import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory }  from 'react-router';
import LessLoader from 'less-hot';

import State from './stores/state';

import './reactions/config';
import './reactions/route';
import './reactions/message';
import './reactions/server';

import SquelchView from './components/squelchView';
import WelcomeView from './components/welcome';
import ServerView from './components/server';
import ChannelView from './components/channel';

// Load our less styles
const lessLoader = new LessLoader();
document.querySelector('head').appendChild(lessLoader(path.join(__dirname, '../less/app.less')));

// Clear hash so reloads work
window.location.hash = '';

State.trigger('config:load');

const onUpdate = function() {
    State.trigger('route:update', this.state);
};

// TODO: wrap in root node that re-renders on State 'update' event
ReactDOM.render(
    <Router history={hashHistory} onUpdate={onUpdate}>
        <Route path="/" component={SquelchView}>
            <IndexRoute component={WelcomeView} />
            <Route path="server/:serverId" component={ServerView} />
            <Route path="server/:serverId/channel/:channel" component={ChannelView} />
        </Route>
    </Router>
, document.getElementById('squelch-root'));

