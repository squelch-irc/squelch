import _ from 'lodash';
import React from 'react';

import Message from './message';

export default class Chat extends React.Component {

    render() {
        const messages = this.props.messages;
        return (
            <div className='message-container'>
                <ul className='messages'>{
                    _.map(messages, (message) =>
                        <Message message={message} key={message.id} />
                    )
                }</ul>
            </div>
        );
    }
}
