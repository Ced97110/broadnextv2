'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CiCircleCheck } from "react-icons/ci";
import Loading from '../../load';

interface PortfolioIconComponentProps {
  Id: number;
  loading:boolean
  InPortfolio: boolean;
  handleAddPortfolio: (Id:number) => void;
  handleRemovePortfolio: (Id:number) => void
  className?: string;
}

export default function Portfolio ({Id,InPortfolio,handleRemovePortfolio,handleAddPortfolio,loading }:PortfolioIconComponentProps ) {

  const handleClick = () => {
    if (InPortfolio) {
      handleRemovePortfolio(Id);
    } else {
      handleAddPortfolio(Id);
    }
  };
  return (
    <Button onClick={handleClick} className="rounded-full cursor-pointer" variant="outline">
      {loading ?  <Loading/> : InPortfolio ? (
        <>
        <CiCircleCheck
          className={`cursor-pointer h-4 w-4 star active`}
          aria-label="Retirer de la watchlist"
          
        />
         In My Portfolio
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Add to my portfolio
        </>
      )}
    </Button>
  );
};

