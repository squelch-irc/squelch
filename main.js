/* eslint no-var:0 */
var app = require('app');
var path = require('path');
var BrowserWindow = require('browser-window');
var Menu = require('menu');

require('electron-debug')();
require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
    Menu.setApplicationMenu(require('./menu')(app));

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 576
    });

    mainWindow.loadUrl(path.join('file://', __dirname, '/app/app.html'));

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    if(process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
    }
});
