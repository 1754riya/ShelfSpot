'use client';

import type { Product } from '@/types';
import { smartProductSearch } from '@/ai/flows/smart-product-search';
import { useState, useEffect } from 'react';
import { ProductCard } from './product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Info } from 'lucide-react';
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
    // If search term is cleared, show all products
    if (!searchTerm.trim()) {
      setDisplayedProducts(allProducts);
      setSearchError(null); // Clear search error when search term is cleared
    }
  }, [searchTerm, allProducts]);
  
  // Update displayed products when allProducts prop changes (e.g., new product added)
  // and no active search is being performed or term is empty.
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

    } catch (error) {
      console.error('Smart search failed:', error);
      setSearchError('Smart search failed. Displaying results based on basic keyword match.');
      // Fallback to simple text search
      const simpleFiltered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedProducts(simpleFiltered);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="Smart search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow rounded-md shadow-sm"
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        />
        <Button onClick={handleSearch} disabled={isSearching} className="w-full sm:w-auto">
          {isSearching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </div>

      {isSearching && (
        <div className="text-center py-4 text-muted-foreground flex items-center justify-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Searching for products...</span>
        </div>
      )}

      {searchError && !isSearching && (
         <Alert variant="destructive" className="mb-6">
           <Info className="h-4 w-4" />
           <AlertTitle>Search Information</AlertTitle>
           <AlertDescription>{searchError}</AlertDescription>
         </Alert>
      )}

      {displayedProducts.length === 0 && !isSearching && (
        <Alert className="mb-6 bg-card border-border shadow-sm">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle>No Products Found</AlertTitle>
          <AlertDescription>
            {searchTerm.trim() ? "No products match your search criteria. Try a different term or clear the search." : "No products have been added yet. Submit a product using the 'Product Submission' tab."}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
