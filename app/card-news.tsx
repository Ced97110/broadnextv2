import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image'; // Using Next.js Image for optimization

interface CardNewsProps {
  Url: string;
  ImageUrl: string;
  Title: string;
  PublishedDate: string;
}

let imageCount = 0;

export const CardNews: FC<CardNewsProps> = ({ Url, ImageUrl, Title, PublishedDate }) => {
  return (
    <Card className="border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      <a href={Url} target="_blank" rel="noopener noreferrer">
        {/* Image */}
        <div className="relative h-52 w-full">
          <Image
           loading={imageCount++ < 15 ? "eager" : "lazy"}
            decoding="sync"
            src={ImageUrl ?? '/logo.png'}
            alt={Title}
            fill={true}
            quality={65}
            className="transition-transform duration-200 transform hover:scale-105 object-cover"
          />
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          {/* Published Date */}
          <p className="text-sm text-gray-500 mb-2">
            <strong>Published Date: </strong>
            {new Date(PublishedDate).toLocaleDateString()}
          </p>

          {/* Title */}
          <CardTitle className="text-lg font-semibold line-clamp-2 mb-3">
            {Title}
          </CardTitle>

          {/* Button */}
          <Button variant="outline" size="sm" className="w-full mt-2">
            Read More
          </Button>
        </CardContent>
      </a>
    </Card>
  );
};