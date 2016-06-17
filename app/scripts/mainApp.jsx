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
const { ServerWrapper, ChannelWrapper, QueryWrapper } = require('./components/stateWrappers');

const Squelch = require('./core/squelchGlobal');
const corePkg = require('./core/corePackage');

window.Squelch = Squelch;

// Hardcode load core package
Squelch.packages.loadPackage('core', corePkg);

State.trigger('config:load');

const onUpdate = function() {
    State.trigger('route:update', this.state);
};

// Pass state to route handlers. This lets us avoid cloning elements in SquelchView
// (React Router wont let us pass state from SquelchView to child views otherwise)
const createElement = (Component, props) =>
    <Component {...props} state={State.get()} />;

ReactDOM.render(
    <Router history={hashHistory} onUpdate={onUpdate} createElement={createElement}>
        <Route path="/" component={SquelchView}>
            <IndexRoute component={WelcomeView} />
            <Route path="server/:serverId" component={ServerWrapper} />
            <Route path="server/:serverId/channel/:channel" component={ChannelWrapper} />
            <Route path="server/:serverId/user/:user" component={QueryWrapper} />
        </Route>
    </Router>
, document.getElementById('squelch-root'));
