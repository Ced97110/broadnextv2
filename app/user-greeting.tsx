'use client'

import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react'

export const UserGreeting = () => {

    const { user, error, isLoading } = useUser();

    const currentHour = parseInt(new Date().toLocaleTimeString("en-US", { hour: "2-digit", hour12: false }));

    let greeting;
  
    if (currentHour < 12) {
      greeting = "Good Morning";
    } else if (currentHour < 17) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Evening";
    }
    
  return (
    <div className='flex flex-col items-center'>
         <h1 className="text-2xl pb-12">  {`${greeting}, ${
              user?.given_name
                ? user.name?.charAt(0).toUpperCase() + user.name?.slice(1) + ""
                : ""
         }`} </h1>
    </div>
  )
}
