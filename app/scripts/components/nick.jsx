const React = require('react');
const classnames = require('classnames');
const hash = require('squelch-nick-hash');

class Nick extends React.Component {
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

module.exports = Nick;
