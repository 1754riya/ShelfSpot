
'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ImageOff, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Added Button import

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const derivedHint = product.dataAiHint || product.name.split(' ').slice(0, 2).join(' ') || "product";
  const seedValue = derivedHint.toLowerCase();
  
  const imageUrl = product.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(seedValue)}/600/450`;

  const handleAddToCart = () => {
    // Placeholder for add to cart functionality
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out group hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border/60 hover:border-primary/70 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:border-primary/70"> {/* Enhanced hover and focus-within */}
      <CardHeader className="p-0 border-b border-border/40">
        <div className="relative aspect-[16/10] w-full bg-muted/40 overflow-hidden rounded-t-xl">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105" // Slightly reduced scale for subtlety
            data-ai-hint={seedValue}
            onError={(e) => {
              const fallbackSeed = `fb-${seedValue}-${product.id}`.toLowerCase();
              e.currentTarget.srcset = `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/600/450`; 
              e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/600/450`;
            }}
          />
           {!product.imageUrl && (
            <Badge variant="secondary" className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-3 py-1 text-xs shadow-md border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"> {/* Enhanced badge styling and hover */}
              Placeholder
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-5 sm:p-6 flex flex-col">
        <CardTitle className="text-xl md:text-2xl font-semibold mb-2 leading-tight tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-200"> {/* Changed font-bold to font-semibold for a softer look */}
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-muted-foreground line-clamp-3 sm:line-clamp-4 mb-4 flex-grow leading-relaxed group-hover:text-foreground/80 transition-colors duration-200"> {/* Hover effect on description */}
          {product.description || "No description available."}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-5 sm:p-6 pt-4 border-t border-border/40 mt-auto bg-muted/20 rounded-b-xl group-hover:bg-muted/40 transition-colors duration-200"> {/* Added padding top and hover effect */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-xl md:text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-200">
            <DollarSign className="mr-1.5 h-5 w-5 sm:h-6 sm:w-6" />
            <span>{product.price && typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</span>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="group-hover:bg-primary group-hover:text-primary-foreground hover:shadow-md transition-all duration-200 ease-in-out transform group-hover:scale-105" // Enhanced button hover
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
