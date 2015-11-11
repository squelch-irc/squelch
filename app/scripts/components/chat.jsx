import _ from 'lodash';
import React from 'react';

import Message from './message';

export default class Chat extends React.Component {

    shouldComponentUpdate(newProps) {
        return this.props.messages !== newProps.messages;
    }

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

Chat.propTypes = {
    messages: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.string.isRequired
        }).isRequired
    ).isRequired
};
