const React = require('react');

class WelcomeView extends React.Component {
    render() {
        return (
            <div className='welcome-view'>
                <img src='https://pbs.twimg.com/media/CKOJ0NXUwAAKzkV.jpg:small' />
                <h1>Welcome to Squelch!</h1>
                <p>This app is broken as frick so why the hell is it even open, dude? Get a life.</p>
            </div>
        );
    }
}

module.exports = WelcomeView;
