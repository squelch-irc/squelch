import _ from 'lodash';

import State from '../stores/state';
import MessageRouter from '../core/messageRouter';

import PluginHandler from '../../core/pluginHandler';

State.on('message:route', ({ server, type, data }) => {
    const state = State.get();
    const { params } = state.route;

    data.id = _.uniqueId();
    data.type = type;
    data.timestamp = new Date();

    // Pass message, server, and current params to MessageRouter
    // to add them to the right logs
    MessageRouter({
        message: data,
        server,
        current: params
    });

});


State.on('message:send', ({ serverId, to, msg }) => {
    const server = State.get().servers[serverId];

    if(PluginHandler.hasCommand(msg)) {
        if(PluginHandler.hasValidCommand(msg)) {
            msg = PluginHandler.runCommand({
                server,
                to,
                msg
            });

            // some commands may only send messages to the user
            if(!msg) return;

        }
        else {
            State.trigger('message:receive', {
                type: 'msg',
                server,
                data: {
                    msg: `${PluginHandler.getCommandName(msg)} is not a valid command.`,
                    to,
                    from: '**squelch**'
                }
            });

            return;
        }
    }

    server.getClient().msg(to, msg);
    State.trigger('message:route', {
        type: 'msg',
        server,
        data: {
            msg,
            to,
            from: server.getClient().nick()
        }
    });
});
