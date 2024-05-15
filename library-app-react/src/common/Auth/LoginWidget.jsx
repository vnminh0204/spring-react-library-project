import { useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import OktaSignInWidget from './OktaSignInWidget';
import {SpinnerLoading} from "../SpinnerLoading/SpinnerLoading";

const LoginWidget = () => {
    const { oktaAuth, authState } = useOktaAuth();
    const navigate = useNavigate();

    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err) => {
        console.log('Sign in error: ', err);
    }

    if (!authState || !authState?.isAuthenticated) {
        return (<SpinnerLoading />);
    }

    if (authState.isAuthenticated) {
        console.log("HERE");
        navigate('/');
        return null;
    }

    return (
        <OktaSignInWidget onSuccess={onSuccess} onError={onError}/>
    );
};

export default LoginWidget;