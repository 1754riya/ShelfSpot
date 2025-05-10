'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/300`}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="product image"
            className="rounded-t-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-xl font-semibold mb-2">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-2">
          {product.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center text-lg font-semibold text-primary">
          <DollarSign className="mr-1 h-5 w-5" />
          {product.price.toFixed(2)}
        </div>
      </CardFooter>
    </Card>
  );
}
