'use client'

import React, { useState } from "react";
import { MaxWidthWrapper } from "./maxwidth";
import NavLogo from "./nav-logo";
import { NavCTAs } from "./nav-cta";
import { NavLinks } from "./nav-link";

export default function NavBar () {
  
  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 bg-zinc-950/0 py-3 transition-colors  backdrop-blur"}`}
    >
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <NavLogo width={56} height={56} />
            <div className="hidden md:block">
              <NavLinks />
            </div>
          </div>
          <NavCTAs />
        </div>
        <div className="block pt-1.5 md:hidden">
          <NavLinks />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
