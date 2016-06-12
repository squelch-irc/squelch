const React = require('react');

const Sidebar = require('./sidebar');
const Theme = require('./theme');
const State = require('../stores/state');

class SquelchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            state: State.get()
        };
    }

    componentDidMount() {
        State.on('update', () => {
            this.setState({ state: State.get() });
        });
    }

    render() {
        const { state } = this.state;

        let content;

        if(!state.ready) {
            content = <div className='squelch-loading'>Loading</div>;
        }
        else {
            content = (
                <div className='window-content'>
                    <div className='pane-group'>
                        <Sidebar state={state} />
                        <div className='pane main-view'>
                            {React.cloneElement(this.props.children, { state })}
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className='window'>
                <Theme theme={state.theme} />
                {content}
            </div>
        );
    }
}

SquelchView.propTypes = {
    children: React.PropTypes.element.isRequired
};

module.exports = SquelchView;
