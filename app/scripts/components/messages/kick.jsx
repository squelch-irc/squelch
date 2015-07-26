import React from 'react';

export default class Kick extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>
                <span className='sender'>{message.kicker}</span>&nbsp;
                <span className='message-info'>kicked {message.nick} from {message.chan}&nbsp;{message.reason ? '(' + message.reason + ')' : ''}</span>
            </span>
        );
    }
}
