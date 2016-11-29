const _ = require('lodash')

const Squelch = require('./squelchGlobal')
const State = require('../stores/state')

module.exports = () => (client) => {
  client.info = Squelch.showMsg

    /**
     * Clears the messages for the given target
     * @param  {[type]} target The channel or user to clear
     */
  client.clear = function (target) {
    Squelch.clear(this.id, target)
  }

  const originalPart = client.part
    /**
     * Closes the view of the target from the UI. If the target is a channel,
     * the client will part the channel before closing.
     * @param  {string} target A channel or user name
     */
  client.close = function (target) {
    if (this.isInChannel(target)) {
      return originalPart.call(client, target)
    }

    Squelch.close(this.id, target)
  }

  client.part = function (channel, ...args) {
    const ret = originalPart.apply(client, [channel].concat(args))
    Squelch.close(this.id, channel)
    return ret
  }

    // Rename these because they use the internal state of the irc client
    // which is different than our state.
  delete client.channels
  delete client.getChannel

    /**
     * Returns an array of channels that the client is currently joined.
     * @return {string[]} Currently joined channels
     */
  client.getJoinedChannels = function () {
    return _(State.get().servers[client.id].channels)
        .filter('joined')
        .map('name')
        .value()
  }

    /**
     * Returns the users currently joined in the given channel.
     * @param  {string} chan The channel to get users from
     * @return {string[]}      Array of users in channel
     */
  client.getUsers = function (chan) {
    return _.values(State.get().servers[client.id].channels[chan].users)
  }

    /**
     * Gets the status symbol of a user. This is usually `@` for op, `+` for
     * voice, or the empty string for a normal user
     * @param  {string} chan Channel to check
     * @param  {string} user User to check
     * @return {string}      The status symbol of user in channel.
     */
  client.getUserStatus = function (chan, user) {
    return State.get().servers[client.id].channels[chan].users[user].status
  }

    /**
     * Returns a list of users that this client has open query windows for.
     * @return {string[]} Array of users with open query windows
     */
  client.getOpenUserWindows = function () {
    return _.keys(State.get().servers[client.id].userMessages)
  }
}
