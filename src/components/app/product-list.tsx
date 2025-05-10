
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
}

export function ProductList({ allProducts }: ProductListProps) {
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
      const relevantProductNames = await smartProductSearch({ query: searchTerm, availableProducts: productNames });
      
      const filteredProducts = allProducts.filter(p => relevantProductNames.includes(p.name));
      setDisplayedProducts(filteredProducts);
      if (filteredProducts.length === 0 && relevantProductNames.length > 0) {
        // This case implies AI found names, but they don't map back to full product objects.
        // This could happen if product names are not unique or mapping logic is flawed.
        // For now, we'll let the "No Products Found" message handle it.
      }

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

  return (
    <div className="container mx-auto py-8 px-0 sm:px-4"> {/* Removed horizontal padding for mobile to allow cards to span full width if needed */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center px-4 sm:px-0">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Smart search products (e.g., 'red comfy chair')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg shadow-md py-3 pl-10 pr-4 text-base" // Enhanced input styling
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching} className="w-full sm:w-auto py-3 px-6 text-base rounded-lg shadow-md"> {/* Enhanced button styling */}
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
         <Alert variant="destructive" className="mb-8 mx-4 sm:mx-0 shadow-lg rounded-lg">
           <Info className="h-5 w-5" />
           <AlertTitle className="font-semibold">Search Information</AlertTitle>
           <AlertDescription>{searchError}</AlertDescription>
         </Alert>
      )}

      {displayedProducts.length === 0 && !isSearching && (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-card rounded-xl shadow-lg mx-4 sm:mx-0">
            <PackageSearch className="h-20 w-20 text-primary mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Products Found</h2>
            <p className="text-muted-foreground max-w-md">
                {searchTerm.trim() ? "We couldn't find any products matching your search. Try using different keywords or broadening your search." : "It looks like there are no products here yet. Try adding some using the 'Add New Product' tab!"}
            </p>
            {searchTerm.trim() && (
                 <Button variant="outline" onClick={() => { setSearchTerm(''); setDisplayedProducts(allProducts); }} className="mt-6">
                    Clear Search & View All
                </Button>
            )}
        </div>
      )}

      {displayedProducts.length > 0 && !isSearching && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-0">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

    