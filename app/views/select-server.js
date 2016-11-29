const _ = require('lodash')
const html = require('choo/html')
const cn = require('classnames')

const Lock = require('../elements/lock')
const Input = require('../elements/input')
const Button = require('../elements/btn')
const PrimaryButton = require('../elements/btnPrimary')

// TODO: make double clicking on server same as clicking next
const Server = (server, isSelected, selectServer) => {
  const classes = cn(
    'dib w5 ph3 pv1 mv3 mr4 link bg-dark-gray dim pointer br1',
    { 'bg-dark-blue': isSelected }
  )
  return html`
    <div class=${classes} onclick=${() => selectServer(server)}>
      <h4 class="f4 mv2">
        ${server.name}
        <span class="fr fill-green">${server.ssl ? Lock() : ''}</span>
      </h4>
      <h5 class="f6 normal mt0 mb2 o-40">${server.hostname}</h5>
    </div>
  `
}

const ServerGroup = (servers, alpha, selected, selectServer) => {
  const isSelected = server => selected && server.name === selected.name
  return html`
    <div class="mt0 mb4">
      <h3 class="ttu tracked fw1 o-40 mv0">${alpha}</h3>
      ${servers.map(server => Server(server, isSelected(server), selectServer))}
    </div>
  `
}

const matchesSearch = (server, search) =>
  server.name.toLowerCase().includes(search.toLowerCase()) ||
  server.hostname.toLowerCase().includes(search.toLowerCase())

const ServerList = ({ search, selected, servers, recommendedServers, serversByAlpha }, selectServer) => {
  if (search) {
    const filteredServers = servers.filter(server => matchesSearch(server, search))
    return html`
      <div class="overflow-y-auto flex-grow">
        ${filteredServers.length
          ? ServerGroup(filteredServers, '', selected, selectServer)
          : html`<div>No servers found.</div>`}
      </div>
    `
  }

  return html`
    <div class="overflow-y-auto flex-grow">
      ${ServerGroup(recommendedServers, 'Recommended', selected, selectServer)}
      ${_.map(serversByAlpha, (servers, alpha) => ServerGroup(servers, alpha, selected, selectServer))}
    </div>
  `
}

module.exports = (state, prev, send) => {
  const updateSearch = search => send('selectServer:search', { search })
  const selectServer = server => send('selectServer:select', { server })
  const gotoCreateServer = (showAdvanced) => () => send('gotoCreateServer', {
    config: state.selectServer.selected,
    showAdvanced
  })
  return html`
    <main class="light-gray bg-near-black pv4 ph5 flex flex-column">
      <div class="flex flex-row justify-between items-center mb3">
        <h1 class="f2 mv0">Select a Server</h1>
        <div class="">${Input({name: 'search', className: 'w5', placeholder: 'Search…', onInput: updateSearch, value: state.selectServer.search})}</div>
      </div>

      ${ServerList(state.selectServer, selectServer)}
      <div class="flex flex-row justify-end mt3">
        ${Button({
          label: 'Back',
          className: 'mr2',
          onClick: () => window.history.back()
        })}
        ${state.selectServer.selected
          ? PrimaryButton({ label: 'Next', onClick: gotoCreateServer(false) })
          : Button({ label: 'Manually Enter Server', onClick: gotoCreateServer(true) })}
      </div>
    </main>
  `
}
