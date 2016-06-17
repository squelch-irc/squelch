const React = require('react');

const WelcomeView = require('./welcome');
const ServerView = require('./server');
const ChannelView = require('./channel');
const QueryView = require('./query');

const ServerWrapper = props => {
    const server = props.state.servers[props.params.serverId];

    // Show the welcome view if a server can't be found
    if(!server) return <WelcomeView />;

    return <ServerView {...props} server={server} />;
};

ServerWrapper.propTypes = {
    state: React.PropTypes.object,
    params: React.PropTypes.shape({
        serverId: React.PropTypes.string.isRequired
    }).isRequired
};

const ChannelWrapper = props => {
    const server = props.state.servers[props.params.serverId];

    // Show the welcome view if a server/channel can't be found
    if(!server || !server.channels[props.params.channel]) {
        return <WelcomeView />;
    }

    const channel = server.channels[props.params.channel];

    return <ChannelView {...props}
        serverId={props.params.serverId}
        channel={channel} />;
};

ChannelWrapper.propTypes = {
    state: React.PropTypes.object,
    params: React.PropTypes.shape({
        serverId: React.PropTypes.string.isRequired,
        channel: React.PropTypes.string.isRequired
    }).isRequired
};

const QueryWrapper = props => {
    const server = props.state.servers[props.params.serverId];

    // Show the welcome view if user messages can't be found
    if(!server || !server.userMessages[props.params.user]) {
        return <WelcomeView />;
    }

    const messages = server.userMessages[props.params.user];

    return <QueryView {...props}
        serverId={props.params.serverId}
        user={props.params.user}
        messages={messages} />;
};

QueryWrapper.propTypes = {
    state: React.PropTypes.object,
    params: React.PropTypes.shape({
        serverId: React.PropTypes.string.isRequired,
        user: React.PropTypes.string.isRequired
    }).isRequired
};

module.exports = { ServerWrapper, ChannelWrapper, QueryWrapper };
