import _ from 'lodash';

import alt from '../alt';

import RouteActions from '../actions/route';

class RouteStore {
    constructor() {
        this.routeState = { params: {} };
        this.bindListeners({
            changeRoute: RouteActions.CHANGE_ROUTE
        });
    }

    changeRoute(data) {
        this.routeState = data;
        this.routeState.params = _.mapValues(this.routeState.params, decodeURIComponent);
    }
}

export default alt.createStore(RouteStore, 'RouteStore');
