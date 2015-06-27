var packager = require('electron-packager');
var argv = require('minimist')(process.argv.slice(2));
var pkg = require ('../package.json');
var _ = require('lodash');

var platforms = argv.platform || argv.p || process.platform;
var archs = argv.arch || argv.a || process.arch;

_.each(platforms.split(','), function(platform) {
    _.each(archs.split(','), function(arch) {
        var packagerOpts = {
            dir: __dirname + '/..',
            name: 'Squelch-' + platform + '-' + arch,
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
        packager(packagerOpts, function(err, path) {
            if (err) { throw err; }
            console.log('Successfully built package at ' + path);
        });
    });
});
