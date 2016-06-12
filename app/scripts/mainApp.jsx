const React = require('react');
const ReactDOM = require('react-dom');
const { Router, Route, IndexRoute, hashHistory }  = require('react-router');

const State = require('./stores/state');

require('./reactions/config');
require('./reactions/route');
require('./reactions/message');
require('./reactions/server');
require('./reactions/theme');

const SquelchView = require('./components/squelchView');
const WelcomeView = require('./components/welcome');
const ServerView = require('./components/server');
const ChannelView = require('./components/channel');
const QueryView = require('./components/query');

const Squelch = require('./core/squelchGlobal');
const corePkg = require('./core/corePackage');

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
