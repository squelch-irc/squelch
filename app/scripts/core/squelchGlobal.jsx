const showMsg = require('./showInfoMsg');
const CommandRegistry = require('./commandRegistry');
const PackageManager = require('./packageManager');

const Squelch = {
    showMsg
};

Squelch.commands = new CommandRegistry(Squelch);
Squelch.packages = new PackageManager(Squelch);

module.exports = Squelch;
