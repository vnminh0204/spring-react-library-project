import {OKTA_CLIENT_ID, OKTA_ISSUER} from "./env";

export const oktaConfig = {
    clientId: `${OKTA_CLIENT_ID}`,
    issuer: `https://${OKTA_ISSUER}/oauth2/default`,
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}