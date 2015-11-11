import React from 'react';

import Msg from './messages/msg';
import Action from './messages/action';
import Join from './messages/join';
import Part from './messages/part';
import Kick from './messages/kick';
import Topic from './messages/topic';
import TopicWho from './messages/topicwho';
import Motd from './messages/motd';
import Mode from './messages/mode';
import Usermode from './messages/usermode';
import Invite from './messages/invite';
import Notice from './messages/notice';
import Nick from './messages/nick';
import Quit from './messages/quit';
import ErrorMsg from './messages/error';
import Raw from './messages/raw';
import Info from './messages/info';
import Timestamp from './messages/timestamp';

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
    nick: Nick,
    quit: Quit,
    error: ErrorMsg,
    raw: Raw,
    info: Info
};

export default class Message extends React.Component {

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
                &nbsp;
                <MessageHandler message={message} />
            </li>
        );
    }
}
