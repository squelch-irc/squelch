// const State = require('./stores/state');
//
// require('./reactions/config');
// require('./reactions/route');
// require('./reactions/message');
// require('./reactions/server');
// require('./reactions/theme');
//
// const SquelchView = require('./components/squelchView');
// const WelcomeView = require('./components/welcome');
// const { ServerWrapper, ChannelWrapper, QueryWrapper } = require('./components/stateWrappers');

// const Squelch = require('./core/squelchGlobal');
// const corePkg = require('./core/corePackage');
//
// window.Squelch = Squelch;
//
// // Hardcode load core package
// Squelch.packages.loadPackage('core', corePkg);
//
// State.trigger('config:load');

const choo = require('choo')
const promisePlugin = require('barracks-promisify-plugin')

const app = choo()
app.use(promisePlugin())

app.model(require('choo-location-electron')())
app.model(require('./models/main'))
app.model(require('./models/select-server'))
app.model(require('./models/edit-server'))
// app.model(require('./models/config'))

app.router('/', [
  ['/', require('./views/welcome')],
  ['/select-server', require('./views/select-server')],
  ['/edit-server', require('./views/edit-server')]
])

const tree = app.start()
document.body.appendChild(tree)
