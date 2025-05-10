'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductSubmissionForm } from '@/components/app/product-submission-form';
import { ProductList } from '@/components/app/product-list';
import { PackagePlus, List, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Error fetching products",
          description: err.message,
        });
      } else {
        setError("An unknown error occurred while fetching products.");
         toast({
          variant: "destructive",
          title: "Error fetching products",
          description: "An unknown error occurred.",
        });
      }
      setProducts([]); // Clear products on error or set to some default
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      // Option 1: Re-fetch all products to ensure consistency
      // await fetchProducts();

      // Option 2: Add the returned product (with ID) to the local state
      const newProduct: Product = await response.json();
      setProducts((prevProducts) => [newProduct, ...prevProducts]);

      toast({
        title: 'Product Submitted!',
        description: `${productData.name} has been added to your products.`,
      });
      return true; // Indicate success
    } catch (err) {
       if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Error adding product",
          description: err.message,
        });
      } else {
        setError("An unknown error occurred while adding product.");
         toast({
          variant: "destructive",
          title: "Error adding product",
          description: "An unknown error occurred.",
        });
      }
      return false; // Indicate failure
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="submission" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 shadow-sm">
          <TabsTrigger value="submission" className="py-3 text-sm sm:text-base">
            <PackagePlus className="mr-2 h-5 w-5" />
            Product Submission
          </TabsTrigger>
          <TabsTrigger value="products" className="py-3 text-sm sm:text-base">
            <List className="mr-2 h-5 w-5" />
            My Products
          </TabsTrigger>
        </TabsList>
        <TabsContent value="submission">
          <ProductSubmissionForm onAddProduct={handleAddProduct} />
        </TabsContent>
        <TabsContent value="products">
          <ProductList allProducts={products} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
