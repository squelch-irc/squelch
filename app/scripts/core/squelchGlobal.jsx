import showMsg from './showInfoMsg';
import CommandRegistry from './commandRegistry';
import PackageManager from './packageManager';

const squelch = {
    showMsg,
    commands: new CommandRegistry(),
    packages: new PackageManager()
};

export default squelch;
