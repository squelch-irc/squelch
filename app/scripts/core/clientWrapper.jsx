const _ = require('lodash');

const Squelch = require('./squelchGlobal');

module.exports =  () => (client) => {
    client.info = Squelch.showMsg;

    /**
     * Clears the messages for the given target
     * @param  {[type]} target The channel or user to clear
     */
    client.clear = function(target) {
        Squelch.clear(this.id, target);
    };

    /**
     * Closes the view of the target from the UI. If the target is a channel,
     * the client will part the channel before closing.
     * @param  {string} target A channel or user name
     */
    client.close = function(target) {
        if(this.isInChannel(target)) {
            return this.part(target);
        }

        Squelch.close(this.id, target);
    };

    client.part = _.wrap(client.part, (part, channel, ...args) => {
        return part.apply(client, [channel].concat(args))

        // Wait for a confirming part event, then close the view
        .then(() => Squelch.close(client.id, channel));
    });
};
