'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { CiCircleCheck } from "react-icons/ci";
import Loading from '../load';
import { FaCheckCircle } from 'react-icons/fa';

interface PortfolioIconComponentProps {
  Id: number;
  loading:boolean
  InPortfolio: boolean;
  handleAddPortfolio: (Id:number) => void;
  handleRemovePortfolio: (Id:number) => void
  className?: string;
}

export default function Portfolio ({Id,InPortfolio,handleRemovePortfolio,handleAddPortfolio,loading }:PortfolioIconComponentProps ) {

  return (
    <>
    {loading ? <Button className="rounded-full cursor-pointer" disabled>
      <Loader2 className="animate-spin" />
      Please wait
     </Button> :
     !InPortfolio ? (
      <Button onClick={() => handleAddPortfolio(Id)} className="rounded-full cursor-pointer" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
           Add to My Portfolio
       </Button> 
    ) : (
      <Button onClick={() => handleRemovePortfolio(Id)} className="rounded-full cursor-pointer" variant="outline">
        <FaCheckCircle className="mr-2 h-4 w-4" />
          In My portfolio
     </Button> 
    )}
    </>
   
  );
};

