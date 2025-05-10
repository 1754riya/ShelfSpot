
'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Trash2, AlertTriangle, Package } from 'lucide-react';
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

  const productId = product.id || ''; 
  const derivedHint = product.dataAiHint || product.name?.split(' ').slice(0, 2).join(' ') || "product item"; // Updated hint
  const seedValue = productId ? `${derivedHint.toLowerCase().replace(' ', '-')}-${productId.substring(0, 4)}` : derivedHint.toLowerCase().replace(' ', '-');
  
  const imageUrl = product.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(seedValue)}/600/450`;

  const handleAddToCart = () => {
    console.log(`Added ${product.name} to cart`);
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
      action: ( // Example action
        <Button variant="outline" size="sm" onClick={() => console.log('Undo add to cart')}>
          Undo
        </Button>
      ),
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
    const success = await onDeleteProduct(productId);
    setIsDeleting(false);
    if (success) {
        // Toast moved to parent to avoid duplication if parent also toasts
    }
  };


  return (
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary/20 dark:hover:shadow-primary/30 transition-all duration-300 ease-in-out group bg-card/80 backdrop-blur-sm border border-border/60 hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:border-primary/70">
      <CardHeader className="p-0 border-b border-border/40 relative">
        <div className="absolute top-3 right-3 z-10"> {/* Increased spacing */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-background/80 text-destructive/80 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 opacity-80 group-hover:opacity-100 shadow-md hover:shadow-lg active:scale-95">
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Delete Product</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-xl shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center text-xl">
                    <AlertTriangle className="mr-3 h-7 w-7 text-destructive" /> {/* Larger icon */}
                    Confirm Deletion
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-base">
                    Are you sure you want to delete the product:
                    <strong className="block mt-1 text-foreground">"{product.name}"</strong>? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-2">
                  <AlertDialogCancel className="hover:bg-muted/80 px-6 py-2.5 text-base">Cancel</AlertDialogCancel> {/* Larger buttons */}
                  <AlertDialogAction 
                    onClick={handleDeleteConfirm} 
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-6 py-2.5 text-base active:scale-95"
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
        <div className="relative aspect-[16/10] w-full bg-muted/30 overflow-hidden rounded-t-xl">
          <Image
            src={imageUrl}
            alt={product.name || 'Product Image'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover rounded-t-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
            data-ai-hint={derivedHint}
            onError={(e) => {
              const fallbackSeed = `fb-${seedValue}-${productId || 'no-id'}`.toLowerCase().replace(' ', '-');
              e.currentTarget.srcset = `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/600/450`; 
              e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/600/450`;
            }}
          />
           {!product.imageUrl && (
            <Badge variant="outline" className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 text-xs shadow-md border-border/70 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 flex items-center gap-1">
              <Package size={14} /> Placeholder {/* Added icon */}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-5 sm:p-6 flex flex-col">
        <CardTitle className="text-xl md:text-2xl font-semibold mb-2.5 leading-tight tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-300">
          {product.name || "Unnamed Product"}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-muted-foreground line-clamp-3 sm:line-clamp-4 mb-4 flex-grow leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
          {product.description || "No description available."}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-5 sm:p-6 pt-4 border-t border-border/40 mt-auto bg-muted/30 rounded-b-xl group-hover:bg-muted/50 transition-colors duration-300">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-xl md:text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
            <DollarSign className="mr-1.5 h-5 w-5 sm:h-6 sm:w-6" />
            <span>{typeof product.price === 'number' && !isNaN(product.price) ? product.price.toFixed(2) : 'N/A'}</span>
          </div>
          <Button 
            size="sm" 
            variant="default" 
            className="group-hover:bg-accent group-hover:text-accent-foreground shadow-md hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
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
