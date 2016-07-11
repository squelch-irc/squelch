module.exports =  (args, { client }) => {

    client.msg('ChanServ', args);

};

module.exports.help = 'An alias for /msg ChanServ';
module.exports.usage = '[message...]';
