import React from 'react';

export default class Topic extends React.Component {

    render() {
        return (
            <div className='topic-wrapper'>
                {this.props.topic}
            </div>
        );
    }
}

Topic.propTypes = {
    topic: React.PropTypes.string
};
