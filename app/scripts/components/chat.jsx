import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import {connectToStores} from 'fluxible-addons-react';

import MessageStore from '../stores/messages';

@connectToStores([MessageStore], (context) => context.getStore(MessageStore).getState())
export default class Chat extends React.Component {

    constructor() {
        super();
    }

    render() {
        let chanMessages = [];
        const {server, messages, channel} = this.props;
        if(messages[server] && messages[server][channel]) {
            chanMessages = messages[server][channel];
        }
        chanMessages = _(chanMessages).compact().reverse().value();
        return (
            <div className='message-container'>
                <ul className='messages'>
                {
                    _.map(chanMessages, (message) => {
                        if(!message) {
                            return null;
                        }
                        return <li className='message' key={message.timestamp + message.sender}>
                            [<span className='timestamp'>{moment(message.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</span>]
                            &nbsp;
                            &lt;<span className='sender-flag'>{message.flag}</span>
                            <span className='sender'>{message.sender}</span>&gt;
                            &nbsp;
                            <span className='sender-message'>{message.message}</span>
                        </li>;
                    })
                }
                </ul>
            </div>
        );
    }
}
