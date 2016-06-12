import _ from 'lodash';

import Squelch from './squelchGlobal';

export default class PackageManager {
    constructor() {
        this.packages = {};
    }

    /**
     * Loads and enables a package.
     * @todo Document how packages work
     * @param  {[type]} name The name of the package to register it under. Must
     *                       be unique.
     * @param  {[type]} pkg  The package itself. Must either be an object or a
     *                       function that returns an object.
     */
    loadPackage(name, pkg) {
        // TODO: have a way to load external packages by their name/location.
        if(this.packages[name]) {
            throw new Error(`Package name conflict: a package has already been registered under ${name}`);
        }

        // Invoke function to get package object
        if(_.isFunction(pkg)) pkg = pkg(Squelch);

        this.packages[name] = pkg;
        this.enablePackage(name);
    }

    /**
     * Enables a package.
     * @param  {string} name The name that the package was registered under.
     */
    enablePackage(name) {
        const pkg = this.packages[name];

        if(!pkg) throw new Error(`Package ${name} does not exist.`);

        // Don't reenable
        if(pkg.enabled) return;

        pkg.enabled = true;
        pkg.initialize(Squelch);
    }

    /**
     * Disables a package.
     * @param  {string} name The name that the package was registered under.
     */
    disablePackage(name) {
        const pkg = this.packages[name];

        if(!pkg) throw new Error(`Package ${name} does not exist.`);

        // Don't redisable
        if(!pkg.enabled) return;

        pkg.enabled = false;
        pkg.destroy(Squelch);
    }

    /**
     * Gets a package.
     * @param  {string} name The name that the package was registered under.
     */
    getPackage(name) {
        return this.packages[name];
    }
}
