import React from "react";
import { useRouter } from "next/navigation";
import { GhostButton } from "@/app/ghost-button";
import { SplashButton } from "@/app/splash-button";

export const NavCTAs = () => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <GhostButton
        onClick={() => router.push("/signin")}
        className="rounded-md px-4 py-1 text-base"
      >
        Sign up
      </GhostButton>
      <SplashButton
        onClick={() => router.push("/signin")}
        className="px-4 py-1 text-base text-zinc-100"
      >
        Sign in
      </SplashButton>
    </div>
  );
};
