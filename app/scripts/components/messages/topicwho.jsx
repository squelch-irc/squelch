import moment from 'moment';
import React from 'react';

export default class TopicWho extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span>
                Set by <span className='topic-setter'>{message.hostmask}</span>
                &nbsp;on <span className='topic-time'>{moment(message.time).format('LLLL')}</span>
            </span>
        );
    }
}
