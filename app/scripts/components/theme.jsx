const React = require('react');

class Theme extends React.Component {
    shouldComponentUpdate(newProps) {
        return this.props.theme !== newProps.theme;
    }

    render() {
        return (
            <style>{this.props.theme.css || ''}</style>
        );
    }
}

Theme.propTypes = {
    theme: React.PropTypes.shape({
        css: React.PropTypes.string
    }).isRequired
};

module.exports = Theme;
