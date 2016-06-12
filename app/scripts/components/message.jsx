const React = require('react');

const Msg = require('./messages/msg');
const Action = require('./messages/action');
const Join = require('./messages/join');
const Part = require('./messages/part');
const Kick = require('./messages/kick');
const Topic = require('./messages/topic');
const TopicWho = require('./messages/topicwho');
const Motd = require('./messages/motd');
const Mode = require('./messages/mode');
const Usermode = require('./messages/usermode');
const Invite = require('./messages/invite');
const Notice = require('./messages/notice');
const NickMsg = require('./messages/nick');
const Quit = require('./messages/quit');
const ErrorMsg = require('./messages/error');
const Raw = require('./messages/raw');
const Info = require('./messages/info');
const Timestamp = require('./messages/timestamp');

const messageHandlers = {
    msg: Msg,
    action: Action,
    join: Join,
    part: Part,
    kick: Kick,
    topic: Topic,
    topicwho: TopicWho,
    motd: Motd,
    mode: Mode,
    usermode: Usermode,
    invite: Invite,
    notice: Notice,
    nick: NickMsg,
    quit: Quit,
    error: ErrorMsg,
    raw: Raw,
    info: Info
};

class Message extends React.Component {

    shouldComponentUpdate(newProps) {
        return this.props.message !== newProps.message;

    }

    render() {
        const message = this.props.message;
        const MessageHandler = messageHandlers[message && message.type];
        if(!MessageHandler) {
            return null;
        }
        return (
            <li className='message'>
                <Timestamp timestamp={message.timestamp} />
                <span className='message-separator'>&nbsp;</span>
                <span className='message-contents'>
                    <MessageHandler message={message} />
                </span>
            </li>
        );
    }
}

Message.propTypes = {
    message: React.PropTypes.shape({
        timestamp: React.PropTypes.instanceOf(Date).isRequired
    }).isRequired
};

module.exports = Message;
