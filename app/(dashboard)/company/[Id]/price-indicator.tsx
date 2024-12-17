
import React from "react";

interface PriceIndicatorProps {
  PriceMovement: number | string;
  PriceChange: number | null | string;
}

const PriceIndicator: React.FC<PriceIndicatorProps> = ({
  PriceMovement,
  PriceChange,
}) => {
  const { className, symbol } = GetPriceIndicator(PriceMovement);
  return (
    <div
      className={`inline-flex items-center justify-center mx-auto text-xs ${className} rounded-full p-1`}
    >
      <span className="mr-1">{symbol}</span>
      {typeof PriceChange === "number" ? `${PriceChange.toFixed(2)}%` : "N/A"}
    </div>
  );
};

export default PriceIndicator;


export function GetPriceIndicator(PriceMovement: number | string) {
  switch (PriceMovement) {
      case 0:
          return { className: 'text-green-600  bg-green-200', symbol: '▲' };
      case 1:
          return { className: 'text-red-600 bg-red-200', symbol: '▼' };
      case 2:
          return { className: 'text-gray-600 bg-gray-200', symbol: '—' };
      default:
          return { className: 'text-gray-600 bg-gray-200', symbol: '—' }; // Default case
  }
}


