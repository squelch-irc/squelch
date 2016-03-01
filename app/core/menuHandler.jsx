
import _ from 'lodash';
import PluginHandler from './pluginHandler';
import { remote } from 'electron';
const { Menu, MenuItem } = remote;

export default class MenuHandler {
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
