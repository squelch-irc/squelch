import React from 'react';

import Sidebar from './sidebar';
import Theme from './theme';
import State from '../stores/state';

export default class SquelchView extends React.Component {
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
        return (
            <div className='window'>
                <Theme theme={this.state.state.theme} />
                <div className='window-content'>
                    <div className='pane-group'>
                        <Sidebar state={this.state.state} />
                        <div className='pane main-view'>
                            {React.cloneElement(this.props.children, {
                                state: this.state.state
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SquelchView.propTypes = {
    children: React.PropTypes.element.isRequired
};
