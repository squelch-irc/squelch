module.exports = () => {
    // Hook into process.stdout so that using the 'debug' module will work
    // See https://github.com/electron/electron/issues/5051
    if(process.env.DEBUG) {
        // Gotta force debug to print to stdout instead of default stderr
        process.env.DEBUG_FD = 1;

        const oldWrite = process.stdout.write;
        process.stdout.write = function(str, enc, fd) {
            console.log(str);
            oldWrite.call(process.stdout, str, enc, fd);
        };
    }
};
