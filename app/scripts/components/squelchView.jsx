import React from 'react';

import Sidebar from './sidebar';
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
            <div id='squelch-view'>
                <Sidebar state={this.state.state} />
                <div className='main-view'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
