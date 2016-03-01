'use strict'; // eslint-disable-line strict
const Menu = require('electron').Menu;
const shell = require('electron').shell;
const BrowserWindow = require('electron').BrowserWindow;

let template;
module.exports = function(app) {
    if(process.platform === 'darwin') {
        template = [
            {
                label: 'Squelch',
                submenu: [
                    {
                        label: 'About Squelch',
                        selector: 'orderFrontStandardAboutPanel:'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Services',
                        submenu: []
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Hide Squelch',
                        accelerator: 'Command+H',
                        selector: 'hide:'
                    },
                    {
                        label: 'Hide Others',
                        accelerator: 'Command+Shift+H',
                        selector: 'hideOtherApplications:'
                    },
                    {
                        label: 'Show All',
                        selector: 'unhideAllApplications:'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Quit',
                        accelerator: 'Command+Q',
                        click() { app.quit(); }
                    }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    {
                        label: 'Undo',
                        accelerator: 'Command+Z',
                        selector: 'undo:'
                    },
                    {
                        label: 'Redo',
                        accelerator: 'Shift+Command+Z',
                        selector: 'redo:'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Cut',
                        accelerator: 'Command+X',
                        selector: 'cut:'
                    },
                    {
                        label: 'Copy',
                        accelerator: 'Command+C',
                        selector: 'copy:'
                    },
                    {
                        label: 'Paste',
                        accelerator: 'Command+V',
                        selector: 'paste:'
                    },
                    {
                        label: 'Select All',
                        accelerator: 'Command+A',
                        selector: 'selectAll:'
                    }
                ]
            },
            {
                label: 'View',
                submenu: [
                    {
                        label: 'Reload Squelch',
                        accelerator: 'Command+R',
                        click() {
                            const focusedWindow = BrowserWindow.getFocusedWindow();
                            if(focusedWindow) {
                                focusedWindow.reload();
                            }
                        }
                    },
                    {
                        label: 'Toggle Full Screen',
                        accelerator: 'Ctrl+Command+F',
                        click() {
                            const focusedWindow = BrowserWindow.getFocusedWindow();
                            if(focusedWindow) {
                                focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                            }
                        }
                    },
                    {
                        label: 'Toggle Developer Tools',
                        accelerator: 'Alt+Command+I',
                        click() {
                            const focusedWindow = BrowserWindow.getFocusedWindow();
                            if(focusedWindow) {
                                focusedWindow.toggleDevTools();
                            }
                        }
                    }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    {
                        label: 'Minimize',
                        accelerator: 'Command+M',
                        selector: 'performMiniaturize:'
                    },
                    {
                        label: 'Close',
                        accelerator: 'Command+W',
                        selector: 'performClose:'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Bring All to Front',
                        selector: 'arrangeInFront:'
                    }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Github Page',
                        click() { shell.openExternal('https://github.com/squelch-irc/squelch'); }
                    },
                    {
                        label: 'Search Issues',
                        click() { shell.openExternal('https://github.com/squelch-irc/squelch/issues'); }
                    }
                ]
            }
        ];
    }
    else {
        template = [
            {
                label: '&File',
                submenu: [
                    {
                        label: '&Open',
                        accelerator: 'Ctrl+O'
                    },
                    {
                        label: '&Close',
                        accelerator: 'Ctrl+W',
                        click() {
                            const focusedWindow = BrowserWindow.getFocusedWindow();
                            if(focusedWindow) {
                                focusedWindow.close();
                            }
                        }
                    }
                ]
            },
            {
                label: '&View',
                submenu: [
                    {
                        label: '&Reload Squelch',
                        accelerator: 'Ctrl+R',
                        click() {
                            const focusedWindow = BrowserWindow.getFocusedWindow();
                            if(focusedWindow) {
                                focusedWindow.reload();
                            }
                        }
                    },
                    {
                        label: 'Toggle &Full Screen',
                        accelerator: 'F11',
                        click() {
                            const focusedWindow = BrowserWindow.getFocusedWindow();
                            if(focusedWindow) {
                                focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                            }
                        }
                    },
                    {
                        label: 'Toggle &Developer Tools',
                        accelerator: 'Alt+Ctrl+I',
                        click() {
                            const focusedWindow = BrowserWindow.getFocusedWindow();
                            if(focusedWindow) {
                                focusedWindow.toggleDevTools();
                            }
                        }
                    }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Github Page',
                        click() { shell.openExternal('https://github.com/squelch-irc/squelch'); }
                    },
                    {
                        label: 'Search Issues',
                        click() { shell.openExternal('https://github.com/squelch-irc/squelch/issues'); }
                    }
                ]
            }
        ];
    }

    return Menu.buildFromTemplate(template);
};
