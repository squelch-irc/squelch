'use strict'; // eslint-disable-line strict

if(process.env.NODE_ENV !== 'development') process.env.NODE_ENV = 'production';

const path = require('path');
const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const Menu = require('electron').Menu;

require('electron-debug')();

let mainWindow = null;

app.on('window-all-closed', () => app.quit());

app.on('ready', () => {
    Menu.setApplicationMenu(require('./menu')(app));

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 576
    });

    mainWindow.loadURL(path.join('file://', __dirname, '/app/app.html'));

    mainWindow.on('closed', () => mainWindow = null);

    if(process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
    }
});
