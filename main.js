var app = require('app');
var BrowserWindow = require('browser-window');

require('electron-debug')();
require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 576,
        "min-width": 768,
        "min-height": 432
    });

    mainWindow.loadUrl('file://' + __dirname + '/app/app.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
    }
});
