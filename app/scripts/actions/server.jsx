import _ from 'lodash';

import State from '../stores/state';
import alt from '../alt';

/*
data.config requires
    server
    port
    nick
    username
    realname
    channels
    ssl
    selfSigned
    certificateExpired
*/
class ServerActions {
    add(data) {
        data.id = _.uniqueId('server');
        this.dispatch(data);
    }

    remove(data) {
        data.id = data.id || data.client.id;
        this.dispatch(data);
    }

    serverEvent(data) {
        State.trigger('message:receive', data);
        this.dispatch(data);
    }
}

export default alt.createActions(ServerActions);
