import config from './config';
import ServerManager from './serverManager';
export default {
    config,
    serverManager: new ServerManager()
};
