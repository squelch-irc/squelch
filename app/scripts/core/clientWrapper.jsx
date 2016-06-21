const _ = require('lodash');

const Squelch = require('./squelchGlobal');
const State = require('../stores/state');

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

    client.part = _.wrap(client.part, function(part, channel, ...args) {
        return part.apply(client, [channel].concat(args))

        // Wait for a confirming part event, then close the view
        .then(() => Squelch.close(this.id, channel));
    });

    /**
     * Returns an array of channels the client is currently in.
     * @return {Array} Array of channels the client is currently in
     */
    client.channels = function() {
        return Object.keys(State.get().servers[this.id].channels);
    };

    /**
     * Checks if the client is in the given channel.
     * @param  {string} chan The channel to check
     * @return {Boolean}     True if the client is in chan, False otherwise
     */
    client.isInChannel = function(chan) {
        return State.get().servers[this.id].channels[chan].joined;
    };
};
