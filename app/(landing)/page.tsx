import React from "react";
import { Problem } from "./problem";
import { Hero } from "./hero";
import { WhoWeServe } from "./who-we-serve";
import { Footer } from "./footer";
import { Solution } from "./solution";
import { Financial } from "./financial-section";
import { UserExperience } from "./user-experience-section";
import { ComparativeAdvantage } from "./comparative-advantage";



export default function Homepage ()  {
  return (
        <>
         <Hero/>
         <Problem/>
         <Solution/>
         <ComparativeAdvantage/>
         <Financial/>
         <WhoWeServe/>
         <UserExperience/>
         <Footer/>
        </>
  );
};
