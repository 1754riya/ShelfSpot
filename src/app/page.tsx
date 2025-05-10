'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductSubmissionForm } from '@/components/app/product-submission-form';
import { ProductList } from '@/components/app/product-list';
import { PackagePlus, List, Loader2, AlertTriangle } from 'lucide-react';
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
        const errorBody = await response.text();
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}. Server responded with: ${errorBody}`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      let detailedMessage = "An unknown error occurred while fetching products.";
      if (err instanceof Error) {
        detailedMessage = err.message;
        if (err.message.toLowerCase().includes('failed to fetch')) {
          detailedMessage = `Could not connect to the product server at ${API_URL}. Please ensure the backend server (Express.js) is running (e.g., using 'npm run server:dev') and accessible. Original error: ${err.message}`;
        }
      }
      setError(detailedMessage);
      toast({
        variant: "destructive",
        title: "Error Fetching Products",
        description: detailedMessage,
        duration: 10000, // Keep toast longer for error messages
      });
      setProducts([]); // Clear products on error
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'dataAiHint'>) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to add product: ${response.status} ${response.statusText}.` }));
        throw new Error(errorData.message || `Failed to add product: ${response.status} ${response.statusText}.`);
      }

      const newProduct: Product = await response.json();
      setProducts((prevProducts) => [newProduct, ...prevProducts]);

      toast({
        title: 'Product Submitted!',
        description: `${productData.name} has been added to your products.`,
      });
      return true; // Indicate success
    } catch (err) {
      let detailedMessage = "An unknown error occurred while adding product.";
       if (err instanceof Error) {
        detailedMessage = err.message;
        if (err.message.toLowerCase().includes('failed to fetch')) {
          detailedMessage = `Could not connect to the product server at ${API_URL} to add product. Please ensure the backend server (Express.js) is running (e.g., using 'npm run server:dev') and accessible. Original error: ${err.message}`;
        }
      }
      setError(detailedMessage); // Set error state to display in the UI
      toast({
        variant: "destructive",
        title: "Error Adding Product",
        description: detailedMessage,
        duration: 10000, // Keep toast longer for error messages
      });
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
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Application Error</AlertTitle>
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
