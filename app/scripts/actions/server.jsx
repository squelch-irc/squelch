export var ServerEventAction = (context, payload, done) => {
    context.dispatch('SERVER_EVENT', payload);
    done();
};

export var AddServerAction = (context, payload, done) => {
    context.dispatch('ADD_SERVER', payload);
    done();
};

export var RemoveServerAction = (context, payload, done) => {
    context.dispatch('REMOVE_SERVER', payload);
    done();
};
