import React from 'react';

export default class Motd extends React.Component {
    render() {
        const message = this.props.message;

        return (
            <span className='motd'><pre class-name='motd-text'>{message.motd}</pre></span>
        );
    }
}

Motd.propTypes = {
    message: React.PropTypes.shape({
        motd: React.PropTypes.string.isRequired
    }).isRequired
};
