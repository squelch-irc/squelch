import ChannelView from '../components/channel';
import WelcomeView from '../components/welcome';

module.exports = {
    // server: {
    //     method: 'GET',
    //     path: '/server/:serverId',
    //     handler: ServerView? (but not the sidebar one!)
    // },
    channel: {
        method: 'GET',
        path: '/server/:serverId/channel/:channel',
        handler: ChannelView
    },
    welcome: {
        method: 'GET',
        path: '/',
        handler: WelcomeView
    }
};
