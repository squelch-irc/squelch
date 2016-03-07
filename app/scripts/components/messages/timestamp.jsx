import React from 'react';
import moment from 'moment';

const TIMESTAMP_FORMAT = 'h:mm:ss a';

export default class Timestamp extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const timestamp = moment(this.props.timestamp).format(TIMESTAMP_FORMAT);

        return <span className='timestamp'>{timestamp}</span>;
    }
}

Timestamp.propTypes = {
    timestamp: React.PropTypes.instanceOf(Date).isRequired
};
