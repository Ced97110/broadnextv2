'use client'

import React from "react";
import Link from "next/link";
import { SiGithub, SiX } from "react-icons/si";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { BubbleButton } from "@/app/bubble-button";
import NavLogo from "@/app/nav-logo";
import { SplashButton } from "@/app/splash-button";
import { FaGoogle } from "react-icons/fa";

export default function SignIn () {
  const router = useRouter();



  return (
    <div className="fixed inset-0 z-50 overflow-y-scroll py-20">
      <BubbleButton
        onClick={() => {
          router.push("/");
        }}
        className="absolute left-4 top-6 text-sm"
      >
        <FiArrowLeft />
        Go back
      </BubbleButton>

      <div
        className="relative z-10 mx-auto w-full max-w-xl p-4"
      >
        <Heading />

        <SocialOptions />
        <Or />
        <Email />
        <Terms />
      </div>

    </div>
  );
};

const Heading = () => (
  <div>
    <NavLogo width={46} height={46} />
    <div className="mb-9 mt-6 space-y-1.5">
     <h1 className="text-2xl font-semibold">Sign in to your account</h1>
      <p className="">
        Don't have an account?{" "}
        <Link href="#" className="text-blue-400">
          Create one.
        </Link>
      </p>
    </div>
  </div>
);

const SocialOptions = () => (
  <div>
    <a href="/api/auth/login">
      <BubbleButton className="flex w-full justify-center py-3">
        Sign in with SSO
      </BubbleButton>
    </a>
  </div>
);

const Or = () => {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-[1px] w-full" />
      <span className="">OR</span>
      <div className="h-[1px] w-full bg-zinc-700" />
    </div>
  );
};

const Email = () => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="mb-3">
        <label htmlFor="email-input" className="mb-1.5 block">
          Email
        </label>
        <input
          id="email-input"
          type="email"
          placeholder="your.email@provider.com"
          className="w-full rounded-md border border-zinc-700  px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <div className="mb-6">
        <div className="mb-1.5 flex items-end justify-between">
          <label htmlFor="password-input" className="block text-zinc-400">
            Password
          </label>
          <Link href="#" className="text-sm text-blue-400">
            Forgot?
          </Link>
        </div>
        <input
          id="password-input"
          type="password"
          placeholder="••••••••••••"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <SplashButton type="submit" className="w-full">
        Sign in
      </SplashButton>
    </form>
  );
};

const Terms = () => (
  <p className="mt-9 text-xs text-zinc-400">
    By signing in, you agree to our{" "}
    <Link href="#" className="text-blue-400">
      Terms & Conditions
    </Link>{" "}
    and{" "}
    <Link href="#" className="text-blue-400">
      Privacy Policy.
    </Link>
  </p>
);
