
'use client';

import type { Product } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const productFormSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }).max(100, { message: 'Product name must be at most 100 characters.'}),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(5000, { message: 'Description must be at most 5000 characters.'}),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  // dataAiHint field removed from schema
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductSubmissionFormProps {
  onAddProduct: (productData: Omit<Product, 'id' | 'dataAiHint'> & { dataAiHint?: string }) => Promise<boolean>;
}

export function ProductSubmissionForm({ onAddProduct }: ProductSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      // dataAiHint default removed
    },
  });

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);
    const productData: Omit<Product, 'id' | 'dataAiHint'> & { dataAiHint?: string } = {
      name: data.name,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl || undefined,
      // dataAiHint removed from productData construction from form values
    };
    
    const success = await onAddProduct(productData);
    
    if (success) {
      form.reset(); 
      toast({
        title: 'Product Submitted!',
        description: `${data.name} has been added to your products.`,
      });
    }
    setIsSubmitting(false);
  }


  return (
    <Card className="max-w-3xl mx-auto shadow-xl rounded-xl bg-card/90 backdrop-blur-sm border-border/60">
      <CardHeader className="p-6 sm:p-8">
        <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground/90">Add a New Product</CardTitle>
        <CardDescription className="text-base text-muted-foreground mt-1 sm:mt-2">
          Fill in the details below to add your product to the catalog.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground/85">Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ergonomic Office Chair" {...field} className="text-base py-3 px-4 rounded-lg shadow-sm border-border/70 focus:border-primary transition-colors"/>
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
                  <FormLabel className="text-lg font-semibold text-foreground/85">Price (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 299.99" {...field} step="0.01" 
                     onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                     className="text-base py-3 px-4 rounded-lg shadow-sm border-border/70 focus:border-primary transition-colors"
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
                  <FormLabel className="text-lg font-semibold text-foreground/85">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your product in detail..." {...field} rows={6} className="text-base py-3 px-4 rounded-lg shadow-sm min-h-[120px] border-border/70 focus:border-primary transition-colors"/>
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
                  <FormLabel className="text-lg font-semibold text-foreground/85">Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/your-product-image.jpg" {...field} className="text-base py-3 px-4 rounded-lg shadow-sm border-border/70 focus:border-primary transition-colors"/>
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground/80">Enter the full URL of the product image. If left blank, a placeholder will be used.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* FormField for dataAiHint removed */}
            <Button type="submit" className="w-full sm:w-auto py-3.5 px-8 text-lg font-medium rounded-lg shadow-md hover:bg-primary/90 transition-all duration-150 ease-in-out bg-primary text-primary-foreground focus:ring-2 focus:ring-primary/50 focus:ring-offset-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-5 w-5" />
              )}
              Add Product
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
