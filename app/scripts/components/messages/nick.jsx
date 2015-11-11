import React from 'react';

export default class Nick extends React.Component {
    render() {
        const message = this.props.message;
        if(message.me) {
            return (
                <span>
                    You are now known as <span className='newnick'>{message.newNick}</span>
                </span>
            );

        }
        return (
            <span>
                <span className='oldnick'>{message.oldNick}</span>
                &nbsp;is now known as <span className='newnick'>{message.newNick}</span>
            </span>
        );
    }
}

Nick.propTypes = {
    message: React.PropTypes.shape({
        oldNick: React.PropTypes.string.isRequired,
        newNick: React.PropTypes.string.isRequired
    }).isRequired
};
