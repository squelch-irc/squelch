module.exports =  (args, { client }) => client.raw(args);

module.exports.help = 'Sends a raw command to the server';
module.exports.usage = '[rawCommand...]';
