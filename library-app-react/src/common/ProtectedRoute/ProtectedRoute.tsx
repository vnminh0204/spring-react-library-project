import {Navigate, Outlet} from "react-router-dom";
import {useOktaAuth} from "@okta/okta-react";
import {SpinnerLoading} from "../SpinnerLoading/SpinnerLoading";

export const ProtectedRoute: React.FC<{
    redirectPath: string,
    children: any}> = (props) => {
    const { authState } = useOktaAuth();

    if (!authState || authState.isPending) {
        return <SpinnerLoading/>;
    }

    if (!authState?.isAuthenticated) {
        return <Navigate to={props.redirectPath} replace />;
    }

    return props.children ? props.children : <Outlet />;
};