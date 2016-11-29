const React = require('react')
const _ = require('lodash')

module.exports = (Squelch) => {
    // Render fn we pass to client.info to tell it how to render each item
  const render = (command) => <span className='help-list-item'>
    {command}
  </span>

  const help = (args, { client }) => {
    if (!args) {
      const commands = _(Squelch.commands.getCommands())
            .keys()
            .sort()
            .value()

      client.info('Available commands are:')
      client.info(commands, { render })
      client.info('For more info on a specific command, use /help [command]')
    }

    const name = args.split(/\s+/)[0]
    const command = Squelch.commands.getCommands()[name]

    if (!command.help && !command.usage) {
      return client.info('No help available for /' + name)
    }

    let help = ''
    if (command.usage) {
      help += [].concat(command.usage)
            .map(usage => `Usage: /${name} ${usage || ''}`)
            .join('\n')
    }
    if (command.help) help = command.help + '\n' + help

    client.info(help)
  }
  help.help = 'Lists all commands or shows help info for a specific command.'
  help.usage = '{command}'

  return help
}
