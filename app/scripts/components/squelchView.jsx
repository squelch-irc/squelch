import React from 'react';
import {handleRoute} from 'fluxible-router';
import Sidebar from './sidebar';
import _ from 'lodash';

@handleRoute
export default class SquelchView extends React.Component {
    render() {
        const Handler = this.props.currentRoute.get('handler');
        const params = _.mapValues(this.props.currentRoute.get('params').toJSON(), decodeURIComponent);
        return (
                <div id='squelch-view'>
                    <Sidebar />
                    <div className='main-view'>
                        <Handler {...params} />
                    </div>
                </div>
        );
    }
}
