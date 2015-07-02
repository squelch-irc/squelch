var packager = require('electron-packager');
var argv = require('minimist')(process.argv.slice(2));
var pkg = require ('../package.json');
var _ = require('lodash');

var platform = argv.platform || argv.p || process.platform;
var arch = argv.arch || argv.a || process.arch;

var packagerOpts = {
    dir: __dirname + '/..',
    name: 'Squelch',
    asar: true,
    version: pkg.devDependencies['electron-prebuilt'].match(/\d+\.\d+\.\d/)[0],
    platform: platform,
    arch: arch,
    out: __dirname + '/../release',
    prune: true,
    ignore: [
    '/test($|/)',
    '/tools($|/)',
    '/scripts($|/)',
    '/release($|/)'
    ]
    // TODO: add icon
};
packager(packagerOpts, function(err, paths) {
    if (err) { throw err; }
    paths.forEach(function(path) {
        console.log('Successfully built package at ' + path);
    });
});
