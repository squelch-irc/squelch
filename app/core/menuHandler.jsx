
const _ = require('lodash');
const PluginHandler = require('./pluginHandler');
const { remote } = require('electron');
const { Menu, MenuItem } = remote;

class MenuHandler {
    static loadUserContextMenu(user) {
        const menu = new Menu();
        const items = PluginHandler.loadUserMenu(user);
        _(items)
            .flatten()
            .map(item => new MenuItem(item))
            .each(item => menu.append(item));
        menu.popup(remote.getCurrentWindow());
    }

    static loadChannelContextMenu(user) {
        const menu = new Menu();
        const items = PluginHandler.loadChannelMenu(user);
        _(items)
            .flatten()
            .map(item => new MenuItem(item))
            .each(item => menu.append(item));
        menu.popup(remote.getCurrentWindow());
    }
}

module.exports = MenuHandler;
