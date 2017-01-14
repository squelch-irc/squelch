const html = require('choo/html')
const cn = require('classnames')

const Timestamp = require('./timestamp')

const Msg = require('./messages/msg')
const Action = require('./messages/action')
const Join = require('./messages/join')
const Part = require('./messages/part')
const Kick = require('./messages/kick')
const Topic = require('./messages/topic')
const TopicWho = require('./messages/topicwho')
const Motd = require('./messages/motd')
const Mode = require('./messages/mode')
const Usermode = require('./messages/usermode')
const Invite = require('./messages/invite')
const Notice = require('./messages/notice')
const NickMsg = require('./messages/nick')
const Quit = require('./messages/quit')
const ErrorMsg = require('./messages/error')
const Raw = require('./messages/raw')
const Raw324 = require('./messages/324')
const Info = require('./messages/info')

const messageHandlers = {
  msg: { template: Msg, noDim: true },
  action: { template: Action, noDim: true },
  join: { template: Join },
  part: { template: Part },
  kick: { template: Kick },
  topic: { template: Topic },
  topicwho: { template: TopicWho },
  motd: { template: Motd },
  mode: { template: Mode },
  usermode: { template: Usermode },
  invite: { template: Invite },
  notice: { template: Notice, noDim: true },
  nick: { template: NickMsg },
  quit: { template: Quit },
  error: { template: ErrorMsg, error: true },
  raw: { template: Raw },
  info: { template: Info }
}

const rawMessageHandlers = {
  324: { handler: Raw324, dim: true }
}

module.exports = (state, msg, send) => {
  const messageHandler = rawMessageHandlers[msg.command] ||
    messageHandlers[msg.type]
  const classes = cn('flex-grow pre-wrap', {
    'red': messageHandler.error,
    'o-60': !messageHandler.noDim
  })

  return html`
  <li class="ph2 pt1 flex items-baseline lh-copy">
    ${Timestamp(msg.timestamp)}
    <div class=${classes}>${messageHandler.template(state, msg, send)}</div>
  </li>
  `
}
