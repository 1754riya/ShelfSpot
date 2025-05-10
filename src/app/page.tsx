'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductSubmissionForm } from '@/components/app/product-submission-form';
import { ProductList } from '@/components/app/product-list';
import { PackagePlus, List } from 'lucide-react';

const initialProducts: Product[] = [
  { id: '1', name: 'Ergonomic Office Chair', price: 299.99, description: 'High-back ergonomic chair with lumbar support and adjustable armrests.', imageUrl: 'https://picsum.photos/seed/chair/400/300' , "data-ai-hint": "office chair"},
  { id: '2', name: 'Modern Oak Dining Table', price: 450.00, description: 'Solid oak dining table with a minimalist design, seats 6.', imageUrl: 'https://picsum.photos/seed/table/400/300', "data-ai-hint": "dining table" },
  { id: '3', name: 'Gaming Desktop PC - Ryzen 7', price: 1200.00, description: 'Powerful gaming desktop with AMD Ryzen 7, RTX 4070, 32GB RAM.', imageUrl: 'https://picsum.photos/seed/desktop/400/300', "data-ai-hint": "gaming pc" },
  { id: '4', name: 'Latest Smartphone Pro Max', price: 999.00, description: 'Flagship smartphone with a stunning display and pro-grade camera system.', imageUrl: 'https://picsum.photos/seed/phone/400/300', "data-ai-hint": "smartphone" },
  { id: '5', name: 'Adjustable Standing Desk', price: 399.50, description: 'Electric height-adjustable standing desk for a healthier workspace.', imageUrl: 'https://picsum.photos/seed/desklamp/400/300', "data-ai-hint": "desk lamp" },
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

