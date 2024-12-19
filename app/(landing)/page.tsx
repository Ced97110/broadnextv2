import React from "react";
import { BubbleButton } from "@/app/bubble-button";
import NavLogo from "@/components/layout/nav-logo";
import { Desktop } from "./home";

export default function SignIn () {
  return (

        <>
        <Desktop/>
        </>
      );
    }



const Heading = () => (
  <div className="mb-6">
    <NavLogo width={46} height={46} />
  </div>
);

const SocialOptions = () => (
  <div className="w-full">
    <a href="/api/auth/login">
      <BubbleButton className="flex w-full justify-center py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
        Sign in or Sign up Here
      </BubbleButton>
    </a>
  </div>
);