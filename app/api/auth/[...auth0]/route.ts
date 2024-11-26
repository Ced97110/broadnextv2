import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login: handleLogin({
        returnTo: '/dashboard',
        authorizationParams: {
            audience: 'https://dev-0g677pmhrof4rua3.us.auth0.com/api/v2/',
            
            
        }
    }),
 })
