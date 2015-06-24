squelch
=======

An IRC client.

## Install

Install dependencies.

```bash
$ npm install
```

## Run

```bash
npm run hot-dev-server
npm run start-hot
```

> Make sure `electron` is available in your PATH!

## Package

```
npm run package
```

#### Options

- --name, -n: Application name (default: ElectronReact)
- --version, -v: Electron version (default: latest version)
- --asar, -a: [asar](https://github.com/atom/asar) support (default: false)
- --icon, -i: Application icon

Use `electron-packager` to pack your app for darwin (osx), linux and win32 (windows) platform. After build, you will see them in `release` folder.

`test`, `tools`, `release` folder and devDependencies in `package.json` will be ignored by default.

#### Default Ignore modules

We add some module's `peerDependencies` to ignore option as default for application size reduction.

- `babel-core` is required by `babel-loader` and its size is ~19 MB
- `node-libs-browser` is required by `webpack` and its size is ~3MB.

> **Note:** If you want to use any above modules in runtime, for example: `require('babel/register')`, you should move them form `devDependencies` to `dependencies`.
