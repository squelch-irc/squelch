import alt from '../alt';

class RouteActions {
    changeRoute(data) {
        this.dispatch(data);
    }
}

export default alt.createActions(RouteActions);
