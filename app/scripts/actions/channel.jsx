import ServerStore from '../stores/servers';
import {ServerEventAction} from './server';

export const Join = (context, payload, done) => {
    context.dispatch('JOIN');
    done();
};

export const SendMessage = (context, payload, done) => {
    const {servers} = context.getStore(ServerStore).getState();
    const server = servers[payload.serverId];

    context.executeAction(ServerEventAction, {
        type: 'msg',
        server,
        data: {
            to: payload.to,
            from: server.nick(),
            msg: payload.msg
        }
    });

    server.msg(payload.to, payload.msg);

    done();
};
