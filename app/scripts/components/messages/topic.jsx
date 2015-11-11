import React from 'react';

export default class Topic extends React.Component {
    render() {
        const message = this.props.message;

        // Ignore no topic messages
        if(message.topic) {
            return (
                <span>
                    Topic is <span className='topic'>{message.topic}</span>
                </span>
            );
        }
    }
}

Topic.propTypes = {
    message: React.PropTypes.shape({
        topic: React.PropTypes.string.isRequired
    }).isRequired
};
