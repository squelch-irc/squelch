import React from 'react';

export default class Raw extends React.Component {
    render() {
        const message = this.props.message;
        return <span className='message-info'>{message.params.slice(1).join(' ')}</span>;
    }
}

Raw.propTypes = {
    message: React.PropTypes.shape({
        params: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    }).isRequired
};
