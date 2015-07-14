import React from 'react';
import moment from 'moment';
import _ from 'lodash';

export default class Chat extends React.Component {

    constructor() {
        super();
        this.state = {
            messages: [
                {timestamp: Date.now(), sender: 'Seiyria', flag: '@', format: '[%hh:%mm:%dd] <%f%s> ', message: 'Hi!'},
                {timestamp: Date.now() + 1, sender: 'Seiyria', flag: '@', format: '<%s> ', message: 'What is up?'},
                {timestamp: Date.now() + 2, sender: 'Seiyria', flag: '@', format: '<%s> ', message: 'I am awesome!'},
                {timestamp: Date.now() + 3, sender: 'KR', flag: '+', format: '<%s> ', message: 'Lol!'},
                {timestamp: Date.now() + 4, sender: 'Freek', flag: '~', format: '<%s> ', message: 'Lol!'}
            ]
        };
    }

    render() {
        return (
            <div className='message-container'>
                <ul className='messages'>
                {
                    _.map(this.state.messages, (message) => {
                        return <li className='message' key={message.timestamp + message.sender}>
                            <span className='timestamp'>{moment(message.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</span>
                            <span className='sender-flag'>{message.flag}</span>
                            <span className='sender'>{message.sender}</span>
                            <span className='sender-message'>{message.message}</span>
                        </li>;
                    })
                }
                </ul>
            </div>
        );
    }
};
