export const oktaConfig = {
    clientId: '0oah2zadzt6WR2wCP5d7',
    issuer: 'https://dev-22671405.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scope: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}