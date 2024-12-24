import { handleAuth, handleCallback, handleLogin } from '@auth0/nextjs-auth0/edge';
import { redirect } from 'next/navigation';


const afterCallback = async (req, session, state) => {
  console.log("Session: ", session.accessToken);
        await fetch("https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/SaveUser",{
            method: 'POST',
            cache: 'force-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
        },
      });
      return session;
}


export const GET = handleAuth({
    login: handleLogin({
        returnTo: '/dashboard',
        authorizationParams: {
            audience: 'https://auth0-authorizer1',
           
        }
    }),
    callback: handleCallback({ afterCallback })
 })
