const path = require('path');
const catw = require('catw');
const concat = require('concat-stream');

const State = require('../stores/state');

const DEFAULT_THEME = 'squelch-base-theme';

State.on('theme:load', ({ useDefault }) => {
    const state = State.get();
    const theme = (useDefault) ? DEFAULT_THEME : state.config.theme || DEFAULT_THEME;

    try {
        const themeDir = path.dirname(require.resolve(theme +'/package.json'));
        const pkg = require(theme +'/package.json');
        const cssPaths = [].concat(pkg.squelch.theme.css).map(
            (cssPath) => path.join(themeDir, cssPath)
        );

        catw(cssPaths, (stream) => {
            stream
            .on('error', (err) => console.error(err))
            .pipe(concat({ encoding: 'string' }, (css) => {
                console.log('setting css');
                State.get().set({
                    theme: { css },
                    ready: true
                });
            }));
        });
        // TODO: Close stream when changing themes
    }

    catch (err) {
        if(theme !== DEFAULT_THEME) {
            console.error(`Unable to load theme ${theme}. Using default theme.`);
            console.error(err);
            return State.trigger('theme:load', { useDefault: true });
        }

        console.error('Something went wrong while trying to load the default theme\n\n' + (err.message || err));
        throw err;
    }

});
