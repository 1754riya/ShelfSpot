
'use client';

import type { Product } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

const productFormSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  dataAiHint: z.string().max(50, {message: 'AI hint must be at most 50 characters.'}).optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductSubmissionFormProps {
  onAddProduct: (productData: Omit<Product, 'id'>) => Promise<boolean>;
}

export function ProductSubmissionForm({ onAddProduct }: ProductSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      dataAiHint: '',
    },
  });

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);
    const productData: Omit<Product, 'id'> = {
      name: data.name,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl || undefined,
      dataAiHint: data.dataAiHint || undefined,
    };
    
    const success = await onAddProduct(productData);
    
    if (success) {
      form.reset(); 
    }
    setIsSubmitting(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-card shadow-lg rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Modern Desk Lamp" {...field} className="rounded-md shadow-sm"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 49.99" {...field} step="0.01" 
                   onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                   className="rounded-md shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your product in detail..." {...field} rows={5} className="rounded-md shadow-sm"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} className="rounded-md shadow-sm"/>
                </FormControl>
                <FormDescription className="text-xs">Enter the URL of the product image. If left blank, a placeholder will be used.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataAiHint"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Image Keywords (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., desk lamp" {...field} className="rounded-md shadow-sm"/>
                </FormControl>
                <FormDescription className="text-xs">Keywords for image search (max 2 words, e.g., "modern lamp"). If imageUrl is provided, this is ignored by placeholder generation but stored.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full sm:w-auto py-3 px-6 text-base rounded-md shadow-md hover:bg-primary/90 transition-colors" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-5 w-5" />
            )}
            Add Product
          </Button>
        </form>
      </Form>
    </div>
  );
}
