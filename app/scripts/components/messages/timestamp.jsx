const React = require('react');
const moment = require('moment');

const TIMESTAMP_FORMAT = 'h:mm:ss a';

class Timestamp extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const timestamp = moment(this.props.timestamp).format(TIMESTAMP_FORMAT);

        return <span className='timestamp'>[{timestamp}]</span>;
    }
}

Timestamp.propTypes = {
    timestamp: React.PropTypes.instanceOf(Date).isRequired
};

module.exports = Timestamp;
