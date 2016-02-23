import React from 'react';

export default class Theme extends React.Component {
    render() {
        return (
            <style>{this.props.theme.css}</style>
        );
    }
}

Theme.propTypes = {
    theme: React.PropTypes.shape({
        css: React.PropTypes.string.isRequired
    })
};
