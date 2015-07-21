/* eslint no-var:0 */
var app = require('app');
var BrowserWindow = require('browser-window');
var path = require('path');

require('electron-debug')();
require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
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
