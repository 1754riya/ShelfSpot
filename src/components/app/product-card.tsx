
'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.imageUrl || `https://picsum.photos/seed/${product.id}/600/450`; // Increased placeholder quality
  const dataAiHintValue = product.dataAiHint || product.name.split(' ').slice(0, 2).join(' ') || "product image";

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group hover:scale-[1.02]">
      <CardHeader className="p-0 border-b border-border/50">
        <div className="relative aspect-[4/3] w-full bg-muted/30">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={dataAiHintValue}
            onError={(e) => {
              // Fallback for broken images, though picsum is usually reliable
              e.currentTarget.srcset = `https://picsum.photos/seed/fallback${product.id}/600/450`;
              e.currentTarget.src = `https://picsum.photos/seed/fallback${product.id}/600/450`;
            }}
          />
           {!product.imageUrl && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
              Placeholder
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-5 flex flex-col"> {/* Increased padding */}
        <CardTitle className="text-xl lg:text-2xl font-bold mb-3 leading-tight tracking-tight">{product.name}</CardTitle>
        <CardDescription className="text-base text-muted-foreground line-clamp-4 mb-4 flex-grow"> {/* Increased line-clamp and text size */}
          {product.description || "No description available."}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-5 pt-0 border-t border-border/50 mt-auto"> {/* Added border-t and mt-auto */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-xl lg:text-2xl font-bold text-primary">
            <DollarSign className="mr-1.5 h-6 w-6" /> {/* Slightly larger icon and margin */}
            <span>{product.price ? product.price.toFixed(2) : 'N/A'}</span>
          </div>
          {/* Future: Add to cart button or other actions here */}
        </div>
      </CardFooter>
    </Card>
  );
}

    