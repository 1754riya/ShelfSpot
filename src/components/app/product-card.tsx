
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
  const dataAiHintValue = product.dataAiHint || product.name.split(' ').slice(0, 2).join(' ') || "product image";
  const imageUrl = product.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(dataAiHintValue)}/600/450`;

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out group hover:scale-[1.03] bg-card/80 backdrop-blur-sm border-border/60 hover:border-primary/50">
      <CardHeader className="p-0 border-b border-border/40">
        <div className="relative aspect-[16/10] w-full bg-muted/40 overflow-hidden rounded-t-xl"> {/* Adjusted aspect ratio and overflow */}
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1" // Enhanced hover effect
            data-ai-hint={dataAiHintValue}
            onError={(e) => {
              e.currentTarget.srcset = `https://picsum.photos/seed/fallback${product.id}/600/450`; // Ensure fallback seed is distinct
              e.currentTarget.src = `https://picsum.photos/seed/fallback${product.id}/600/450`;
            }}
          />
           {!product.imageUrl && (
            <Badge variant="secondary" className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-3 py-1 text-xs shadow-md border border-border/50"> {/* Enhanced badge styling */}
              Placeholder
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-5 sm:p-6 flex flex-col"> {/* Responsive padding */}
        <CardTitle className="text-xl md:text-2xl font-bold mb-3 leading-tight tracking-tight text-foreground/90 group-hover:text-primary transition-colors"> {/* Enhanced title */}
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-muted-foreground line-clamp-3 sm:line-clamp-4 mb-4 flex-grow leading-relaxed"> {/* Responsive line-clamp and leading */}
          {product.description || "No description available."}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-5 sm:p-6 pt-0 border-t border-border/40 mt-auto bg-muted/20 rounded-b-xl"> {/* Footer styling */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-xl md:text-2xl font-bold text-primary">
            <DollarSign className="mr-1.5 h-5 w-5 sm:h-6 sm:w-6" /> {/* Responsive icon size */}
            <span>{product.price && typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</span>
          </div>
          {/* Future: Add to cart button or other actions here 
          <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Details
          </Button>
          */}
        </div>
      </CardFooter>
    </Card>
  );
}

    
