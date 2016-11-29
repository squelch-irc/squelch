const Button = require('./btn')

module.exports = (opts) => {
  opts.colors = 'light-gray bn bg-dark-blue hover-white hover-bg-blue'
  return Button(opts)
}
