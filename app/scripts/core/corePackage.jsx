const { CompositeDisposable } = require('event-kit');

const shrug = require('../commands/shrug');
const me = require('../commands/me');
const msg = require('../commands/msg');

const CoreCommandPackage = (Squelch) => {
    return {
        initialize() {
            this.subscriptions = new CompositeDisposable();
            this.subscriptions.add(Squelch.commands.register('shrug', shrug));
            this.subscriptions.add(Squelch.commands.register('me', me));
            this.subscriptions.add(Squelch.commands.register('msg', msg));
        },

        destroy() {
            if(this.subscriptions) this.subscriptions.dispose();
        }
    };
};

module.exports =  CoreCommandPackage;
