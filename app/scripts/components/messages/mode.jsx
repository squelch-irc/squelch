import React from 'react';
import Nick from '../nick';

export default class Mode extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='mode-set'>
                <Nick nick={message.sender} />
                &nbsp;sets mode <span className='mode'>{message.mode}</span>
            </span>
        );
    }
}

Mode.propTypes = {
    message: React.PropTypes.shape({
        sender: React.PropTypes.string.isRequired,
        mode: React.PropTypes.string.isRequired

    }).isRequired
};
