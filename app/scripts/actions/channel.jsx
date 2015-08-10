import alt from '../alt';

class ChannelActions {
    join(data) {
        this.dispatch(data);
    }

    sendMessage(data) {
        this.dispatch(data);
    }
}

export default alt.createActions(ChannelActions);
