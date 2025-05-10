
'use client';

import type { Product } from '@/types';
import { smartProductSearch } from '@/ai/flows/smart-product-search';
import { useState, useEffect } from 'react';
import { ProductCard } from './product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Info, PackageSearch } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProductListProps {
  allProducts: Product[];
  onDeleteProduct: (productId: string) => Promise<boolean>;
}

export function ProductList({ allProducts, onDeleteProduct }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(allProducts);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    // This effect ensures that if the searchTerm is cleared, or if allProducts array changes
    // (e.g., due to adding or deleting a product externally to search),
    // the displayedProducts list is reset to the current allProducts,
    // but only if no active search term is present.
    if (!searchTerm.trim()) {
      setDisplayedProducts(allProducts);
      setSearchError(null); // Clear any previous search error
    }
  }, [searchTerm, allProducts]);
  
  // This effect might seem redundant, but it specifically handles the initial load 
  // and direct updates to allProducts (like deletions happening outside search)
  // ensuring the displayed list reflects the master list if no search is active.
  useEffect(() => {
    if (!searchTerm.trim()) { 
        setDisplayedProducts(allProducts);
    }
  }, [allProducts, searchTerm]);


  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setDisplayedProducts(allProducts);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      const productNames = allProducts.map(p => p.name);
      const relevantProductNames = await smartProductSearch({ query: searchTerm, availableProducts: productNames });
      
      const filteredProducts = allProducts.filter(p => relevantProductNames.includes(p.name));
      setDisplayedProducts(filteredProducts);
      
      // If AI found names but they don't map back, or if no names found by AI
      if (filteredProducts.length === 0 && relevantProductNames.length > 0) {
         // This case implies AI found names, but they don't map back to full product objects.
         // This could happen if product names are not unique or mapping logic is flawed.
         // For now, we'll let the "No Products Found" message handle it,
         // or potentially add a specific message here.
      } else if (filteredProducts.length === 0 && relevantProductNames.length === 0) {
        // AI found nothing, and thus filtered list is also empty.
        // "No Products Found" will be shown.
      }


    } catch (error) {
      console.error('Smart search failed:', error);
      setSearchError('Smart search is unavailable. Displaying results using basic keyword matching.');
      // Fallback to simple text search if AI fails
      const simpleFiltered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setDisplayedProducts(simpleFiltered);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-0 sm:px-4">
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center px-4 sm:px-0">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Smart search products (e.g., 'red comfy chair')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg shadow-md py-3 pl-10 pr-4 text-base hover:border-primary/70 focus:border-primary/90 transition-all duration-200"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching} className="w-full sm:w-auto py-3 px-6 text-base rounded-lg shadow-md hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 active:scale-95">
          {isSearching ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-2 h-5 w-5" />
          )}
          Search
        </Button>
      </div>

      {isSearching && (
        <div className="text-center py-10 text-muted-foreground flex flex-col items-center justify-center min-h-[200px]">
          <Loader2 className="mr-2 h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg">Searching for products...</p>
        </div>
      )}

      {searchError && !isSearching && (
         <Alert variant="destructive" className="mb-8 mx-4 sm:mx-0 shadow-lg rounded-lg border-destructive/60 bg-destructive/5">
           <Info className="h-5 w-5 text-destructive" />
           <AlertTitle className="font-semibold text-destructive">Search Information</AlertTitle>
           <AlertDescription className="text-destructive/90">{searchError}</AlertDescription>
         </Alert>
      )}

      {displayedProducts.length === 0 && !isSearching && (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-card rounded-xl shadow-xl border border-border/60 mx-4 sm:mx-0 hover:shadow-2xl transition-shadow duration-300">
            <PackageSearch className="h-20 w-20 text-primary mb-6 opacity-80" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Products Found</h2>
            <p className="text-muted-foreground max-w-md">
                {searchTerm.trim() ? "We couldn't find any products matching your search. Try using different keywords or broadening your search." : "It looks like there are no products here yet. Try adding some using the 'Product Submission' tab!"}
            </p>
            {searchTerm.trim() && (
                 <Button variant="outline" onClick={() => { setSearchTerm(''); setDisplayedProducts(allProducts); setSearchError(null); }} className="mt-6 hover:bg-accent/80 hover:text-accent-foreground transition-colors">
                    Clear Search & View All
                </Button>
            )}
        </div>
      )}

      {displayedProducts.length > 0 && !isSearching && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-0">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onDeleteProduct={onDeleteProduct} />
          ))}
        </div>
      )}
    </div>
  );
}
