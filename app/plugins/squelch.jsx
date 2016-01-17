
// all plugins are passed a copy of State

export const shrug = () => {
    return {
        run: (args) => `${args || ''} ¯\\_(ツ)_/¯`.trim()
    };
};

export const test = () => {
    return {
        run: (args) => 'this is a test'
    };
};
