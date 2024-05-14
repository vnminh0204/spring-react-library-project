import React, {useEffect, useRef} from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
import {oktaConfig} from '../../configs/oktaConfig';

interface OktaSignInWidgetProps {
    onSuccess: (tokens: any) => void;
    onError: (err: Error) => void;
    config?: any; // Add config prop here if needed
}

const OktaSignInWidget: React.FC<OktaSignInWidgetProps> = ({onSuccess, onError}) => {
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
    }, [onSuccess, onError]);

    return (
        <div className='container mt-5 mb-5'>
            <div ref={widgetRef}></div>
        </div>
    );
};

export default OktaSignInWidget;
