import { Search } from "lucide-react";
import React from "react";
import NavbarLanding from "./nav";
import { Button } from "@/components/ui/button";
import { Problem } from "./problem";
import { Hero } from "./hero";
import { Key } from "./key";
import { WhoWeServe } from "./who-we-serve";
import { Footer } from "./footer";



export const Desktop = () => {
  return (

        <>
         <Hero/>
         <Problem/>
         <Key/>
         <WhoWeServe/>
         <Footer/>
        </>

  );
};
