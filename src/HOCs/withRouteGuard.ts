import {compose, lifecycle} from 'recompose';
import {connect} from 'react-redux';

import { navigate } from '@/actions/app.actions';
import { isUserLoggedIn } from '@/selectors/auth.selectors';

/**
 * Route Guard can tell the router whether or not it should allow navigation to a requested route 
 * @note: this HOC does not check neither socket is authenticated
 * 
 * @param {React$Element} WrapComponent 
 * @return {React$Element}
 */

const mapStateToProps = (state, props) => ({
    isLoggedIn: isUserLoggedIn(state)
});

const mapDispatchToProps = (dispatch) => ({
    redirect(name) {
        dispatch(navigate(name));
    }
});

interface RouteGuardParam {
    directTo: string;
};

export const withRouteGuard = ({directTo}: RouteGuardParam) => (WrapComponent) => (compose(
    connect(mapStateToProps, mapDispatchToProps), 
    lifecycle({
        componentDidMount() {
            const {isLoggedIn, redirect} = this.props;            
            if(!isLoggedIn) {
                if(directTo) {
                    redirect(directTo);
                }
            }
        },

        componentWillReceiveProps(nextProps) {
            if(!nextProps.isLoggedIn) {
                if(directTo) {
                    const {redirect} = this.props;

                    redirect(directTo);
                }
            }
        },
    })
)(WrapComponent));