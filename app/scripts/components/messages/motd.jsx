import React from 'react';

export default class Motd extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span>MOTD: <pre>{message.motd}</pre></span>
        );
    }
}

Motd.propTypes = {
    message: React.PropTypes.shape({
        motd: React.PropTypes.string.isRequired
    }).isRequired
};
