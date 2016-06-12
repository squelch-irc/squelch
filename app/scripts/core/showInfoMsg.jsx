import State from '../stores/state';

const showInfoMsg = (msg) => {
    State.trigger('message:receive', {
        server: State.get().getCurrentServer(),
        type: 'info',
        data: { msg }
    });
};

export default showInfoMsg;
