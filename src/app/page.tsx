
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductSubmissionForm } from '@/components/app/product-submission-form';
import { ProductList } from '@/components/app/product-list';
import { PackagePlus, List, Loader2, AlertTriangle, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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
      price: typeof price === 'number' && !isNaN(price) ? price : 0, // Ensure price is a valid number, default to 0 if not
      dataAiHint: product.dataAiHint || product.data_ai_hint 
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
        duration: 7000, 
      });
      setProducts([]); 
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => { 
    try {
      const payload = {
        ...productData,
        "data-ai-hint": productData.dataAiHint 
      };
      delete (payload as any).dataAiHint; 

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorBody = "No additional details from server.";
        try {
          errorBody = await response.json().catch(() => `Server response: ${response.status} ${response.statusText}`);
        } catch (e) {
          // Ignore if response body cannot be read
        }
        throw new Error( typeof errorBody === 'string' ? errorBody : (errorBody as {message: string})?.message || `Failed to add product: ${response.status} ${response.statusText}.`);
      }

      const newProductResponse: any = await response.json();
      const newProduct: Product = parseProductPrice(newProductResponse);
      
      setProducts((prevProducts) => [newProduct, ...prevProducts]);

      toast({
        title: 'Product Submitted!',
        description: `${productData.name} has been added to your products.`,
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
        duration: 7000, 
      });
      return false; 
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col justify-center items-center min-h-[calc(100vh-12rem)]"> {/* Adjusted min-height and padding */}
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <p className="text-xl text-muted-foreground">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 sm:py-12 px-4"> {/* Adjusted padding */}
      <div className="flex items-center justify-center sm:justify-start mb-10">
        <LayoutDashboard className="h-10 w-10 mr-3 text-primary" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Product Dashboard
        </h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8 shadow-xl rounded-xl p-6"> {/* Enhanced shadow and padding */}
          <AlertTriangle className="h-6 w-6" /> {/* Slightly larger icon */}
          <AlertTitle className="font-bold text-lg">Application Error</AlertTitle> {/* Bolder and larger title */}
          <AlertDescription className="text-base mt-1">{error} {/* Slightly larger description */}
          <p className="mt-3 text-sm text-muted-foreground/90"> {/* Adjusted styling for readability */}
              Please ensure your backend server is running (<code>npm run server:dev</code>) and connected to the PostgreSQL database.
              Check the <a href="https://github.com/GoogleCloudPlatform/idx-e2e-shelfspot/blob/main/README.md#troubleshooting-error-fetching-products--failed-to-fetch--networkerror" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-destructive-foreground">Troubleshooting Guide</a> for more help.
            </p>
          </AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="submission" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-8 shadow-lg rounded-xl h-auto p-1.5 bg-muted"> {/* Enhanced TabsList styling */}
          <TabsTrigger value="submission" className="py-3 text-sm sm:text-base font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-150 ease-in-out">
            <PackagePlus className="mr-2 h-5 w-5" />
            Add New Product
          </TabsTrigger>
          <TabsTrigger value="products" className="py-3 text-sm sm:text-base font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-150 ease-in-out">
            <List className="mr-2 h-5 w-5" />
            View My Products
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

    