const { CompositeDisposable } = require('event-kit');

const shrug = require('../commands/shrug');
const me = require('../commands/me');
const msg = require('../commands/msg');
const join = require('../commands/join');
const part = require('../commands/part');
const clear = require('../commands/clear');
const clearall = require('../commands/clearall');
const mode = require('../commands/mode');
const op = require('../commands/op');
const deop = require('../commands/deop');
const voice = require('../commands/voice');
const devoice = require('../commands/devoice');
const info = require('../commands/info');
const slap = require('../commands/slap');
const notice = require('../commands/notice');
const raw = require('../commands/raw');
const amsg = require('../commands/amsg');
const ame = require('../commands/ame');
const disconnect = require('../commands/disconnect');
const kick = require('../commands/kick');
const kickban = require('../commands/kickban');
const ns = require('../commands/ns');
const cs = require('../commands/cs');
const ban = require('../commands/ban');
const unban = require('../commands/unban');

const CoreCommandPackage = (Squelch) => {
    return {
        initialize() {
            this.subscriptions = new CompositeDisposable();
            this.subscriptions.add(Squelch.commands.register('shrug', shrug));
            this.subscriptions.add(Squelch.commands.register('me', me));
            this.subscriptions.add(Squelch.commands.register('msg', msg));
            this.subscriptions.add(Squelch.commands.register('join', join));
            this.subscriptions.add(Squelch.commands.register('j', join));
            this.subscriptions.add(Squelch.commands.register('part', part));
            this.subscriptions.add(Squelch.commands.register('p', part));
            this.subscriptions.add(Squelch.commands.register('leave', part));
            this.subscriptions.add(Squelch.commands.register('close', part));
            this.subscriptions.add(Squelch.commands.register('clear', clear));
            this.subscriptions.add(Squelch.commands.register('clearall', clearall));
            this.subscriptions.add(Squelch.commands.register('mode', mode));
            this.subscriptions.add(Squelch.commands.register('op', op));
            this.subscriptions.add(Squelch.commands.register('deop', deop));
            this.subscriptions.add(Squelch.commands.register('voice', voice));
            this.subscriptions.add(Squelch.commands.register('devoice', devoice));
            this.subscriptions.add(Squelch.commands.register('info', info));
            this.subscriptions.add(Squelch.commands.register('echo', info));
            this.subscriptions.add(Squelch.commands.register('slap', slap));
            this.subscriptions.add(Squelch.commands.register('notice', notice));
            this.subscriptions.add(Squelch.commands.register('raw', raw));
            this.subscriptions.add(Squelch.commands.register('amsg', amsg));
            this.subscriptions.add(Squelch.commands.register('ame', ame));
            this.subscriptions.add(Squelch.commands.register('disconnect', disconnect));
            this.subscriptions.add(Squelch.commands.register('quit', disconnect));
            this.subscriptions.add(Squelch.commands.register('kick', kick));
            this.subscriptions.add(Squelch.commands.register('kickban', kickban));
            this.subscriptions.add(Squelch.commands.register('ns', ns));
            this.subscriptions.add(Squelch.commands.register('cs', cs));
            this.subscriptions.add(Squelch.commands.register('ban', ban));
            this.subscriptions.add(Squelch.commands.register('unban', unban));
        },

        destroy() {
            if(this.subscriptions) this.subscriptions.dispose();
        }
    };
};

module.exports =  CoreCommandPackage;
