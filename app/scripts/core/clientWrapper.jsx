import Squelch from './squelchGlobal';

export default () => (client) => {
    client.info = Squelch.showMsg;
};
