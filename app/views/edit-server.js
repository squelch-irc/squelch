const html = require('choo/html')

const FormInput = require('../elements/form-input')
const Checkbox = require('../elements/checkbox')
const Button = require('../elements/btn')
const PrimaryButton = require('../elements/btnPrimary')

const Info = (label, value) => html`
  <div class="mr5">
    <h4 class="f6 fw2 ttu tracked mt3 mb2 gray">${label}</h4>
    <h5 class="f4 mv0">${value}</h5>
  </div>
`

const ServerInfo = (config) => html`
  <div class="flex flex-wrap pb4 mb4 bb b--dark-gray">
    ${Info('Name', config.name)}
    ${Info('Hostname', config.server)}
    ${Info('Port', config.port)}
  </div>
`

module.exports = (state, prev, send) => {
  const { config, showAdvanced, validation } = state.editServer
  const toggleAdvanced = () => send('editServer:toggleAdvanced')
  const updateConfig = (prop) => value => send('editServer:setConfig', { [prop]: value })

  let err = {}
  if (validation.err) err = validation.err.toJSON()

  const form = []
  if (showAdvanced) {
    form.push(
      FormInput({
        label: 'Server Name',
        subLabel: 'The name you want to give this server',
        value: config.name,
        error: err.name,
        onInput: updateConfig('name')
      }),
      FormInput({
        label: 'Hostname',
        subLabel: 'The hostname that this server is hosted at',
        value: config.server,
        error: err.server,
        onInput: updateConfig('server')
      }),
      FormInput({
        label: 'Port',
        subLabel: 'The server port to connect to',
        type: 'number',
        value: config.port,
        error: err.port,
        min: 0,
        max: 65535,
        onInput: updateConfig('port')
      }),
      Checkbox({
        label: 'Use SSL',
        subLabel: 'Securely connect to the server (if the server supports it)',
        checked: config.ssl,
        className: 'mb3',
        onChange: updateConfig('ssl')
      }),
      FormInput({
        label: 'Server Username',
        subLabel: 'This option is antiquated. Mostly used for IRC bouncers',
        value: config.username,
        error: err.username,
        onInput: updateConfig('username')
      }),
      FormInput({
        label: 'Server Password',
        subLabel: 'The password required for connecting to the server',
        type: 'password',
        value: config.password,
        error: err.password,
        onInput: updateConfig('password')
      })
    )
  }
  form.push(FormInput({
    label: 'Nickname',
    subLabel: 'The name that you want to chat with',
    value: config.nick,
    error: err.nick,
    onInput: updateConfig('nick')
  }))
  if (showAdvanced) {
    form.push(FormInput({
      label: 'Real Name',
      subLabel: 'The name that shows up when someone requests your WHOIS',
      value: config.realname,
      error: err.realname,
      onInput: updateConfig('realname')
    }))
  }

  return html`
    <main class="light-gray bg-near-black pv4 ph5 flex flex-column">
      <h1 class="f2 mt0 mb3">Server Settings</h1>

      ${!showAdvanced ? ServerInfo(config) : ''}

      <form class="flex-grow overflow-y-scroll">
        ${form}
      </form>

      <div class="flex flex-row justify-between align-center mt3">
        ${Checkbox({
          label: 'Show Advanced Settings',
          checked: showAdvanced,
          onChange: toggleAdvanced
        })}
        <div class="flex flex-row">
          ${Button({
            label: 'Back',
            className: 'mr2',
            onClick: () => window.history.back()
          })}
          ${PrimaryButton({
            label: 'Save',
            disabled: !validation.valid,
            onClick: () => send('editServer:save')
          })}
        </div>
      </div>
    </main>
  `
}
