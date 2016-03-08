import React from 'react';
import classnames from 'classnames';
import hash from 'squelch-nick-hash';

export default class Nick extends React.Component {
    render() {
        const { nick, appendText, prependText } = this.props;
        const className = classnames({
            [this.props.className]: true,
            nick: true,
            ['nick-color-' + hash(nick)]: true
        });

        const text = (prependText || '')  + nick + (appendText || '');

        return <span className={className}>{text}</span>;
    }
}

Nick.propTypes = {
    nick: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    appendText: React.PropTypes.string,
    prependText: React.PropTypes.string
};
