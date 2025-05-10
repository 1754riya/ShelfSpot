
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductSubmissionForm } from '@/components/app/product-submission-form';
import { ProductList } from '@/components/app/product-list';
import { PackagePlus, List, Loader2, AlertTriangle, LayoutDashboard, ShieldAlert } from 'lucide-react'; // Added ShieldAlert
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const parseProductPrice = (product: any): Product => {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    return {
      ...product,
      id: product.id || String(Date.now() + Math.random()), // Ensure id is always a string, fallback for safety
      price: typeof price === 'number' && !isNaN(price) ? price : 0,
      dataAiHint: product.dataAiHint || product.data_ai_hint || product.name?.toLowerCase().split(" ").slice(0,2).join(" ") || 'product item' // Updated hint
    };
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        let errorBody = "No additional details from server.";
        try {
          errorBody = await response.text();
        } catch (e) {
          // Ignore if response body cannot be read
        }
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}. Server responded with: ${errorBody}`);
      }
      const data: any[] = await response.json();
      const productsWithParsedPrice = data.map(parseProductPrice);
      setProducts(productsWithParsedPrice);
    } catch (err) {
      let detailedMessage = "An unknown error occurred while fetching products.";
      if (err instanceof Error) {
        detailedMessage = err.message;
        if (err.message.toLowerCase().includes('failed to fetch') || err.constructor.name === 'TypeError' /* NetworkError often a TypeError */) {
          detailedMessage = `NetworkError: Could not connect to the product server at ${API_URL}. Please ensure the backend server (Express.js) is running (e.g., using 'npm run server:dev') and accessible. Also, check your browser's console for more specific network error details (e.g., CORS issues). Original error: ${err.message}`;
        }
      }
      console.error("Fetch Products Error:", detailedMessage, err);
      setError(detailedMessage);
      toast({
        variant: "destructive",
        title: "Error Fetching Products",
        description: detailedMessage,
        duration: 9000, // Increased duration
      });
      setProducts([]); 
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'dataAiHint'>) => { 
    try {
      const payload = {
        ...productData,
      };

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorBodyText = `Server response: ${response.status} ${response.statusText}`;
        try {
            const errorBodyJson = await response.json();
            errorBodyText = errorBodyJson.message || JSON.stringify(errorBodyJson);
        } catch (e) {
            try {
                errorBodyText = await response.text();
            } catch (parseTextError) {
                // If reading as text fails, use the initial status text
            }
        }
        throw new Error(`Failed to add product. ${errorBodyText}`);
      }

      const newProductResponse: any = await response.json();
      const newProduct: Product = parseProductPrice(newProductResponse);
      
      setProducts((prevProducts) => [newProduct, ...prevProducts]);

      toast({
        title: 'Product Submitted!',
        description: `${newProduct.name} has been added successfully.`,
        className: 'bg-green-500 text-white dark:bg-green-600', // Custom success toast style
      });
      return true; 
    } catch (err) {
      let detailedMessage = "An unknown error occurred while adding product.";
       if (err instanceof Error) {
        detailedMessage = err.message;
        if (err.message.toLowerCase().includes('failed to fetch') || err.constructor.name === 'TypeError') {
          detailedMessage = `NetworkError: Could not connect to the product server at ${API_URL} to add product. Please ensure the backend server (Express.js) is running (e.g., using 'npm run server:dev') and accessible. Original error: ${err.message}`;
        }
      }
      console.error("Add Product Error:", detailedMessage, err);
      setError(detailedMessage); 
      toast({
        variant: "destructive",
        title: "Error Adding Product",
        description: detailedMessage,
        duration: 9000, 
      });
      return false; 
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        let errorBodyText = `Server response: ${response.status} ${response.statusText}`;
        try {
            const errorBodyJson = await response.json();
            errorBodyText = errorBodyJson.message || JSON.stringify(errorBodyJson);
        } catch (e) {
            try {
                errorBodyText = await response.text();
            } catch (parseTextError) {
              //
            }
        }
        throw new Error(`Failed to delete product. ${errorBodyText}`);
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      toast({
        title: 'Product Deleted',
        description: 'The product has been successfully removed.',
        className: 'bg-primary text-primary-foreground', // Informative toast style
      });
      return true;
    } catch (err) {
      let detailedMessage = "An unknown error occurred while deleting product.";
      if (err instanceof Error) {
        detailedMessage = err.message;
         if (err.message.toLowerCase().includes('failed to fetch') || err.constructor.name === 'TypeError') {
          detailedMessage = `NetworkError: Could not connect to the product server at ${API_URL} to delete product. Please ensure the backend server (Express.js) is running. Original error: ${err.message}`;
        }
      }
      console.error("Delete Product Error:", detailedMessage, err);
      toast({
        variant: "destructive",
        title: "Error Deleting Product",
        description: detailedMessage,
        duration: 9000,
      });
      return false;
    }
  };


  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col justify-center items-center min-h-[calc(100vh-12rem)]">
        <Loader2 className="h-20 w-20 animate-spin text-primary mb-8" /> {/* Larger loader */}
        <p className="text-2xl text-muted-foreground tracking-wide">Loading Products...</p> {/* Enhanced text */}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 sm:py-12 px-4">
      <div className="flex items-center justify-center sm:justify-start mb-10">
        <LayoutDashboard className="h-12 w-12 mr-4 text-primary" /> {/* Larger icon */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"> {/* Gradient text */}
          Product Dashboard
        </h1>
      </div>

      {error && !products.length && ( 
        <Alert variant="destructive" className="mb-8 shadow-xl rounded-xl p-6 border-destructive/70 bg-destructive/10 hover:shadow-destructive/30 transition-all duration-300 ease-in-out">
          <ShieldAlert className="h-8 w-8 text-destructive" /> {/* Different Icon */}
          <AlertTitle className="font-bold text-xl text-destructive">Application Error</AlertTitle> {/* Larger Title */}
          <AlertDescription className="text-base mt-2 text-destructive/90">{error}
          <p className="mt-4 text-sm text-destructive/80">
              Please ensure your backend server is running (<code>npm run server:dev</code>) and connected to the PostgreSQL database.
              Check the <a href="https://github.com/GoogleCloudPlatform/idx-e2e-shelfspot/blob/main/README.md#troubleshooting-error-fetching-products--failed-to-fetch--networkerror" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-destructive transition-colors">Troubleshooting Guide</a> for more help.
            </p>
            <Button variant="outline" onClick={fetchProducts} className="mt-6 border-destructive text-destructive hover:bg-destructive/10">
              <Loader2 className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : 'hidden'}`} />
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="submission" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-8 shadow-xl rounded-xl h-auto p-2 bg-muted/60 backdrop-blur-md border border-border/50">
          <TabsTrigger value="submission" className="py-3.5 text-base sm:text-lg font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary/40 data-[state=active]:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2.5 hover:bg-primary/10 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary transform hover:scale-105 data-[state=active]:scale-100">
            <PackagePlus className="h-6 w-6" />
            Product Submission
          </TabsTrigger>
          <TabsTrigger value="products" className="py-3.5 text-base sm:text-lg font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary/40 data-[state=active]:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2.5 hover:bg-primary/10 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary transform hover:scale-105 data-[state=active]:scale-100">
            <List className="mr-2 h-6 w-6" />
            My Products
          </TabsTrigger>
        </TabsList>
        <TabsContent value="submission">
          <ProductSubmissionForm onAddProduct={handleAddProduct} />
        </TabsContent>
        <TabsContent value="products">
          <ProductList allProducts={products} onDeleteProduct={handleDeleteProduct} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
