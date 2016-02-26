import React from 'react';
import classnames from 'classnames';
import hash from 'squelch-nick-hash';

export default class Nick extends React.Component {
    render() {
        const nick = this.props.nick;
        const className = classnames({
            [this.props.className]: true,
            nick: true,
            ['nick-color-' + hash(nick)]: true
        });

        return <span className={className}>{nick}</span>;
    }
}

Error.propTypes = {
    nick: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
};
