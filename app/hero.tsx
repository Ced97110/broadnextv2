'use client'

import { FiArrowRight } from "react-icons/fi";
import { MaxWidthWrapper } from "../components/layout/maxwidth";
import { GlowingChip } from "./glowing-chip";
import { SplashButton } from "./splash-button";
import { GhostButton } from "./ghost-button";
import { useRouter } from "next/navigation";

export default function Hero () {


  const router = useRouter();
  return (
    <MaxWidthWrapper className="relative z-20 flex flex-col items-center justify-center pb-12 pt-24 md:pb-36 md:pt-36">
      <div
       
        className="relative"
      >
        <GlowingChip>Exciting announcement 🎉</GlowingChip>
      </div>
      <h1
        className="mb-3 text-center text-3xl font-bold leading-tight  sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-8xl lg:leading-tight"
      >
       Unlock Market Insights with AI-Powered Intelligence
      </h1>
      <p
        className="mb-9 max-w-2xl text-center text-base text-zinc-400 sm:text-lg md:text-xl"
      >
        Stay ahead of the competition with real-time data and actionable insights.
      </p>
      <div
        className="flex flex-col items-center gap-4 sm:flex-row"
      >
        <SplashButton
          onClick={() => router.push("/signin")}
          className="flex items-center gap-2"
        >
          Try it free
          <FiArrowRight />
        </SplashButton>
        <GhostButton
          onClick={() => router.push("/#features")}
          className="rounded-md px-4 py-2 text-lg"
        >
          Learn more
        </GhostButton>
      </div>
    </MaxWidthWrapper>
  );
};
