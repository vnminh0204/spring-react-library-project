import React from 'react';
import {useOktaAuth} from '@okta/okta-react';
import OktaSignInWidget from './OktaSignInWidget';
import {SpinnerLoading} from '../SpinnerLoading/SpinnerLoading';
import {Navigate} from 'react-router-dom';


const LoginWidget: React.FC<any> = ({config}) => {
    const {oktaAuth, authState} = useOktaAuth();

    const onSuccess = (tokens: any) => {
        if (!oktaAuth) return;
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err: Error) => {
        console.log('Sign in error: ', err);
    };

    if (!authState) {
        return <SpinnerLoading/>;
    }

    if (authState.isAuthenticated) {
        return <Navigate replace to='/'/>;
    }

    return <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError}/>;
};

export default LoginWidget;
