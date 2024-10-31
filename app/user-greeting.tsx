'use client'

import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react'

export const UserGreeting = () => {

const { user, error, isLoading } = useUser();   

  return (
    <div className='flex flex-col items-center mt-6'>
         <h1 className="text-2xl pb-12">  {`Welcome, ${
              user?.given_name
                ? user.name?.charAt(0).toUpperCase() + user.name?.slice(1) + ""
                : ""
         }`} </h1>
    </div>
  )
}
