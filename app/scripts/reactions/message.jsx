import State from '../stores/state';
import ServerActions from '../actions/server';

State.on('message:send', ({ serverId, to, msg }) => {

    const server = State.get().servers[serverId];
    server.getClient().msg(to, msg);
    ServerActions.serverEvent({
        type: 'msg',
        server,
        data: {
            msg,
            to,
            from: server.getClient().nick()
        }
    });
});
