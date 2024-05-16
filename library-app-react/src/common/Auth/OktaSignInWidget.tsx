import React, {useEffect, useRef} from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
import '../../../node_modules/@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import {oktaConfig} from "../../configs/oktaConfig";
import {useOktaAuth} from "@okta/okta-react";
import {useNavigate} from "react-router-dom";
import {SpinnerLoading} from "../SpinnerLoading/SpinnerLoading";
import {Tokens} from '@okta/okta-auth-js';


const OktaSignInWidget = () => {

    const {oktaAuth, authState} = useOktaAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authState && authState.isAuthenticated) {
            navigate('/');
        }
    }, [authState, navigate]);

    const onSuccess = (tokens: Tokens | undefined) => {
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err: any) => {
        console.log('Sign in error: ', err);
    }

    const widgetRef = useRef<HTMLDivElement>(null);
    useEffect(() => {

        if (!widgetRef.current) {
            return;
        }

        const widget = new OktaSignIn(oktaConfig);

        widget.showSignInToGetTokens({
            el: widgetRef.current as unknown as string,
        }).then(onSuccess).catch(onError);

        return () => widget.remove();
    });

    if (!authState) {
        return (<SpinnerLoading/>);
    }

    return (<div ref={widgetRef}/>);
};

export default OktaSignInWidget;
