'use client'
import { VercelLogo } from '@/components/icons';
import React, { useEffect, useState } from 'react';
import { UserGreeting } from '../user-greeting';

export default function Welcome({ setIsLoading }) {

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Function to handle the welcome screen logic
    const handleWelcomeScreen = () => {
      // Check if 'hasVisited' is set in localStorage
      const hasVisited = localStorage.getItem('hasVisited');

      if (!hasVisited) {
    
        setIsVisible(true); 

        // Set 'hasVisited' in localStorage
        localStorage.setItem('hasVisited', 'true');

        // Set a timer to hide the welcome component after 2 seconds
        const timer = setTimeout(() => {
          setIsVisible(false); // Hide the welcome component
          setIsLoading(false); // Update loading state
        }, 1500);

        // Clear the timer on component unmount
        return () => clearTimeout(timer);
      } else {
        // User has visited before
        setIsLoading(false); // Update loading state immediately
      }
    };

    // Ensure that the code runs only on the client side
    if (typeof window !== 'undefined') {
      handleWelcomeScreen();
    }
  }, [setIsLoading]);

  // If the welcome component is not visible, render nothing
  if (!isVisible) {
    return null;
  }

  // Render the welcome component
  return (
    <div
      className={`flex items-center justify-center w-screen h-screen transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center">
        <VercelLogo width={130} height={130} />
      </div>
    </div>
  );
}