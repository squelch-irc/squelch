import React from 'react';
import _ from 'lodash';

import ServerListItem from './serverListItem';

export default class ServerList extends React.Component {

    shouldComponentUpdate(newProps) {
        const { state } = this.props;
        const newState = newProps.state;
        return state.servers !== newState.servers ||
            state.route !== newState.route;
    }

    render() {
        const servers = _.map(this.props.state.servers, (server) =>
            <ServerListItem key={server.id} serverId={server.id} state={this.props.state}/>
        );

        return (
            <div className='server-list'>{servers}</div>
        );
    }
}

ServerList.propTypes = {
    state: React.PropTypes.object.isRequired
};
