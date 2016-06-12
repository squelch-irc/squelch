import _ from 'lodash';

import State from '../stores/state';
import MessageRouter from '../core/messageRouter';
import Squelch from '../core/squelchGlobal';

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
    // true if message is being sent to server (no target).
    const isToServer = !to;

    // Skip command check if msg starts with '//' and strip first '/'
    let checkCommand = true;
    if(!isToServer && /^\/\//.test(msg)) {
        checkCommand = false;
        msg = msg.substr(1);
    }

    // Force prepend messages to server with '/', so only commands are sent.
    if(isToServer && !/^\//.test(msg)) {
        msg = '/' + msg;
    }

    if(checkCommand && Squelch.commands.handleInput(msg)) return;

    server.getClient().msg(to, msg);
});
