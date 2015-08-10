import _ from 'lodash';

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
        this.dispatch(data);
    }

    remove(data) {
        this.dispatch(data);
    }

    serverEvent(data) {
        data.data.id = _.uniqueId();
        this.dispatch(data);
    }
}

export default alt.createActions(ServerActions);
