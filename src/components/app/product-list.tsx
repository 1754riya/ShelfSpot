
'use client';

import type { Product } from '@/types';
import { smartProductSearch } from '@/ai/flows/smart-product-search';
import { useState, useEffect } from 'react';
import { ProductCard } from './product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Info, PackageSearch, XCircle } from 'lucide-react'; // Added XCircle
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
    if (!searchTerm.trim()) {
      setDisplayedProducts(allProducts);
      setSearchError(null); 
    }
  }, [searchTerm, allProducts]);
  
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
      // Ensure productNames is not empty before calling AI to prevent potential errors
      if (productNames.length === 0) {
        setDisplayedProducts([]);
        return;
      }
      const relevantProductNames = await smartProductSearch({ query: searchTerm, availableProducts: productNames });
      
      const filteredProducts = allProducts.filter(p => relevantProductNames.includes(p.name));
      setDisplayedProducts(filteredProducts);
      
    } catch (error) {
      console.error('Smart search failed:', error);
      setSearchError('Smart search encountered an issue. Displaying results using basic keyword matching.');
      const simpleFiltered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setDisplayedProducts(simpleFiltered);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDisplayedProducts(allProducts);
    setSearchError(null);
  };

  return (
    <div className="container mx-auto py-8 px-0 sm:px-4">
      <div className="mb-10 flex flex-col sm:flex-row gap-4 items-center px-4 sm:px-0">
        <div className="relative flex-grow w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            type="text"
            placeholder="Smart search for products (e.g., 'comfortable blue armchair')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg shadow-lg py-3.5 pl-12 pr-10 text-base border-border/70 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 ease-in-out hover:shadow-primary/20" // Enhanced styling
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={isSearching} size="lg" className="w-full sm:w-auto py-3.5 px-8 text-base rounded-lg shadow-lg hover:shadow-primary/40 bg-primary text-primary-foreground transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-[0.97]">
          {isSearching ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-2 h-5 w-5" />
          )}
          Search
        </Button>
      </div>

      {isSearching && (
        <div className="text-center py-16 text-muted-foreground flex flex-col items-center justify-center min-h-[250px]">
          <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary mb-6" />
          <p className="text-xl tracking-wide">Searching for products...</p>
          <p className="text-sm mt-1">Please wait a moment.</p>
        </div>
      )}

      {searchError && !isSearching && (
         <Alert variant="destructive" className="mb-8 mx-4 sm:mx-0 shadow-lg rounded-xl border-destructive/60 bg-destructive/10 p-5 hover:shadow-destructive/20 transition-shadow duration-300">
           <Info className="h-6 w-6 text-destructive" />
           <AlertTitle className="font-semibold text-lg text-destructive">Search Information</AlertTitle>
           <AlertDescription className="text-destructive/90 mt-1">{searchError}</AlertDescription>
         </Alert>
      )}

      {displayedProducts.length === 0 && !isSearching && (
        <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-card rounded-xl shadow-xl border border-border/50 mx-4 sm:mx-0 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 ease-in-out min-h-[300px]">
            <PackageSearch className="h-24 w-24 text-primary mb-8 opacity-70" />
            <h2 className="text-3xl font-semibold text-foreground mb-3">No Products Found</h2>
            <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
                {searchTerm.trim() ? "We couldn't find any products matching your search. Try using different keywords or broaden your search terms." : "It looks like there are no products here yet. Try adding some using the 'Product Submission' tab!"}
            </p>
            {searchTerm.trim() && (
                 <Button variant="outline" onClick={clearSearch} className="mt-8 py-3 px-6 text-base hover:bg-accent hover:text-accent-foreground transition-colors duration-200 transform hover:scale-105 active:scale-95">
                    Clear Search & View All
                </Button>
            )}
        </div>
      )}

      {displayedProducts.length > 0 && !isSearching && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-10 px-4 sm:px-0"> {/* Increased gap */}
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onDeleteProduct={onDeleteProduct} />
          ))}
        </div>
      )}
    </div>
  );
}
