
'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Trash2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';


interface ProductCardProps {
  product: Product;
  onDeleteProduct: (productId: string) => Promise<boolean>;
}

export function ProductCard({ product, onDeleteProduct }: ProductCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // Ensure product.id is always a string, even if undefined from backend briefly
  const productId = product.id || ''; 
  const derivedHint = product.dataAiHint || product.name?.split(' ').slice(0, 2).join(' ') || "product";
  const seedValue = productId ? `${derivedHint.toLowerCase()}-${productId.substring(0, 4)}` : derivedHint.toLowerCase();
  
  const imageUrl = product.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(seedValue)}/600/450`;

  const handleAddToCart = () => {
    // Placeholder for add to cart functionality
    console.log(`Added ${product.name} to cart`);
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!productId) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Product ID is missing, cannot delete.",
        });
        return;
    }
    setIsDeleting(true);
    await onDeleteProduct(productId);
    setIsDeleting(false);
    // Toast messages are handled in the parent component (HomePage)
  };


  return (
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out group hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border/60 hover:border-primary/70 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:border-primary/70">
      <CardHeader className="p-0 border-b border-border/40 relative">
        <div className="absolute top-2 right-2 z-10">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-background/70 text-destructive/80 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 opacity-70 group-hover:opacity-100 shadow-md hover:shadow-lg">
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Delete Product</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-6 w-6 text-destructive" />
                    Are you sure you want to delete this product?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product
                    <span className="font-semibold"> "{product.name}"</span> from the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-muted/80">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteConfirm} 
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Yes, delete product"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
        <div className="relative aspect-[16/10] w-full bg-muted/40 overflow-hidden rounded-t-xl">
          <Image
            src={imageUrl}
            alt={product.name || 'Product Image'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={derivedHint} // Use derivedHint for the AI hint attribute
            onError={(e) => {
              const fallbackSeed = `fb-${seedValue}-${productId || 'no-id'}`.toLowerCase();
              e.currentTarget.srcset = `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/600/450`; 
              e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/600/450`;
            }}
          />
           {!product.imageUrl && (
            <Badge variant="secondary" className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-3 py-1 text-xs shadow-md border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
              Placeholder
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-5 sm:p-6 flex flex-col">
        <CardTitle className="text-xl md:text-2xl font-semibold mb-2 leading-tight tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-200">
          {product.name || "Unnamed Product"}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-muted-foreground line-clamp-3 sm:line-clamp-4 mb-4 flex-grow leading-relaxed group-hover:text-foreground/80 transition-colors duration-200">
          {product.description || "No description available."}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-5 sm:p-6 pt-4 border-t border-border/40 mt-auto bg-muted/20 rounded-b-xl group-hover:bg-muted/40 transition-colors duration-200">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-xl md:text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-200">
            <DollarSign className="mr-1.5 h-5 w-5 sm:h-6 sm:w-6" />
            <span>{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</span>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="group-hover:bg-primary group-hover:text-primary-foreground hover:shadow-md transition-all duration-200 ease-in-out transform group-hover:scale-105 border-primary/50 hover:border-primary text-primary hover:text-primary-foreground"
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
