'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductSubmissionForm } from '@/components/app/product-submission-form';
import { ProductList } from '@/components/app/product-list';
import { PackagePlus, List } from 'lucide-react';

const initialProducts: Product[] = [
  { id: '1', name: 'Modern Desk Lamp', price: 49.99, description: 'A sleek and stylish LED desk lamp with adjustable brightness.', imageUrl: 'https://picsum.photos/seed/lamp/400/300' , "data-ai-hint": "desk lamp"},
  { id: '2', name: 'Wireless Ergonomic Mouse', price: 35.50, description: 'Comfortable wireless mouse designed for long hours of use.', imageUrl: 'https://picsum.photos/seed/mouse/400/300', "data-ai-hint": "computer mouse" },
  { id: '3', name: 'Bookshelf Speakers (Pair)', price: 129.00, description: 'High-fidelity bookshelf speakers for immersive audio.', imageUrl: 'https://picsum.photos/seed/speakers/400/300', "data-ai-hint": "bookshelf speakers" },
];


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load products from localStorage on mount (simulating backend fetch)
    const storedProducts = localStorage.getItem('shelfspot-products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Initialize with some default products if nothing in localStorage
      setProducts(initialProducts);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Save products to localStorage whenever they change
    if (isMounted) {
        localStorage.setItem('shelfspot-products', JSON.stringify(products));
    }
  }, [products, isMounted]);

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };

  if (!isMounted) {
    // Optional: render a loading skeleton or null while waiting for client-side mount
    // to avoid hydration issues with localStorage.
    return null; 
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
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
