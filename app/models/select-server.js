const _ = require('lodash')

const networks = require('irc-networks')
.map(network => {
  return Object.assign(
    {},
    network,
    _.orderBy(network.servers, ['isMainServer', 'ssl'], ['desc', 'desc'])[0]
  )
})

const networksByAlpha = _.groupBy(networks, network => {
  if (network.name.match(/^[A-Za-z]/)) return network.name[0].toUpperCase()
  return '#'
})

const recommendedNetworks = [
  _.find(networks, ['name', 'freenode']),
  _.find(networks, ['name', 'EsperNet'])
]

module.exports = {
  namespace: 'selectServer',
  state: {
    search: '',
    selected: null,
    servers: networks,
    serversByAlpha: networksByAlpha,
    recommendedServers: recommendedNetworks
  },
  reducers: {
    reset: (state, data) => {
      return module.exports.state
    },
    search: (state, { search }) => ({ search }),
    select: (state, { server }) => ({ selected: server })
  }
}
