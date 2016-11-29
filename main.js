if (process.env.NODE_ENV !== 'development') process.env.NODE_ENV = 'production'

const path = require('path')
const app = require('electron').app
const BrowserWindow = require('electron').BrowserWindow
const Menu = require('electron').Menu
const localShortcut = require('electron-localshortcut')

require('electron-debug')()

const load = (win) => win.loadURL(path.join('file://', __dirname, '/app/index.html'))

const reload = () => {
  load(BrowserWindow.getFocusedWindow())
}

let mainWindow = null

app.on('window-all-closed', () => app.quit())

app.on('ready', () => {
  // Override electron-debug shortcut to reload from home page
  localShortcut.register('CmdOrCtrl+R', reload)
  localShortcut.register('F5', reload)

  Menu.setApplicationMenu(require('./menu')(app))

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 576
  })

  load(mainWindow)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools()
  }
})
