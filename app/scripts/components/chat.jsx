import React from 'react';
import pureRender from 'pure-render-decorator';

import Message from './message';

@pureRender
export default class Chat extends React.Component {

    render() {
        const messages = this.props.messages;
        return (
            <div className='message-container'>
                <ul className='messages'>{
                    messages.map((message) =>
                        <Message message={message} key={message.id} />
                    )
                }</ul>
            </div>
        );
    }
}
