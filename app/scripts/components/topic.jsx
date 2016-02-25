import React from 'react';

export default class Topic extends React.Component {

    render() {
        return (
            <div className='topic-bar'>
                {this.props.topic || '(No Topic)'}
            </div>
        );
    }
}

Topic.propTypes = {
    topic: React.PropTypes.string
};
