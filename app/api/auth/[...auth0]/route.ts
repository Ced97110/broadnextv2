import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login: handleLogin({
        returnTo: '/dashboard',
        authorizationParams: {
            audiencedience: 'https://dev-ffd53yq7flug5v6j.us.auth0.com/api/v2/',
        }
    }),
 })
