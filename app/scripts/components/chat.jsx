import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

import Message from './message';
import MenuHandler from '../../core/menuHandler';

export default class Chat extends React.Component {

    shouldComponentUpdate(newProps) {
        return this.props.messages !== newProps.messages;
    }

    loadContextMenu(e) {
        e.preventDefault();
        MenuHandler.loadChannelContextMenu(this);
    }

    render() {
        const messages = this.props.messages;
        return (
            <div className='message-container' onContextMenu={this.loadContextMenu.bind(this.props.channel)}>
                <ul className='messages'>{
                    _.map(messages, (message) =>
                        <Message message={message} key={message.id} />
                    )
                }</ul>
            </div>
        );
    }

    componentWillUpdate() {
        const node = ReactDOM.findDOMNode(this);
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
    }

    componentDidUpdate() {
        if (this.shouldScrollBottom) {
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    }
}

Chat.propTypes = {
    messages: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    channel: React.PropTypes.string.isRequired
};
