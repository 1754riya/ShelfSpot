
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
import { PlusCircle, Loader2, Tag, DollarSign, Text, Image as ImageIcon, Info } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const productFormSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }).max(100, { message: 'Product name must be at most 100 characters.'}),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }).min(0.01, { message: 'Price must be greater than 0.'}),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(5000, { message: 'Description must be at most 5000 characters.'}),
  imageUrl: z.string().url({ message: 'Please enter a valid URL (e.g., https://example.com/image.jpg).' }).optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductSubmissionFormProps {
  onAddProduct: (productData: Omit<Product, 'id' | 'dataAiHint'>) => Promise<boolean>;
}

export function ProductSubmissionForm({ onAddProduct }: ProductSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      price: undefined, // Use undefined for better placeholder behavior with type="number"
      description: '',
      imageUrl: '',
    },
  });

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);
    const productData: Omit<Product, 'id' | 'dataAiHint'> = {
      name: data.name,
      price: data.price, // Zod already coerced to number
      description: data.description,
      imageUrl: data.imageUrl || undefined, // Ensure empty string becomes undefined
    };
    
    const success = await onAddProduct(productData);
    
    if (success) {
      form.reset(); 
      toast({ // Toast moved here from page.tsx for successful submission to provide immediate feedback
        title: "Product Added!",
        description: `${data.name} is now in your catalog.`,
        className: "bg-green-500 text-white dark:bg-green-600",
      });
    }
    setIsSubmitting(false);
  }


  return (
    <Card className="max-w-3xl mx-auto shadow-xl rounded-xl bg-card/90 backdrop-blur-md border-border/60 hover:shadow-primary/20 dark:hover:shadow-primary/30 transition-all duration-300 ease-in-out">
      <CardHeader className="p-6 sm:p-8 border-b border-border/40">
        <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground/90 flex items-center gap-3">
          <PlusCircle className="h-8 w-8 text-primary" />
          Add New Product
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground mt-2">
          Fill in the details below to add your product. Fields marked with <span className="text-destructive font-medium">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground/85 hover:text-primary transition-colors duration-200 flex items-center">
                    <Tag className="mr-2.5 h-5 w-5 text-primary/80" /> 
                    Product Name <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Modern LED Desk Lamp" {...field} className="text-base py-3 px-4 rounded-lg shadow-sm border-border/70 focus:border-primary focus:ring-primary/50 transition-all hover:border-primary/70"/>
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
                  <FormLabel className="text-lg font-semibold text-foreground/85 hover:text-primary transition-colors duration-200 flex items-center">
                    <DollarSign className="mr-2.5 h-5 w-5 text-primary/80" />
                    Price (USD) <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                     type="number" 
                     placeholder="e.g., 49.99" 
                     {...field} 
                     step="0.01"
                     min="0.01" // HTML5 validation
                     className="text-base py-3 px-4 rounded-lg shadow-sm border-border/70 focus:border-primary focus:ring-primary/50 transition-all hover:border-primary/70"
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
                  <FormLabel className="text-lg font-semibold text-foreground/85 hover:text-primary transition-colors duration-200 flex items-center">
                    <Text className="mr-2.5 h-5 w-5 text-primary/80" />
                    Description <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your product's features, benefits, and materials..." {...field} rows={6} className="text-base py-3 px-4 rounded-lg shadow-sm min-h-[140px] border-border/70 focus:border-primary focus:ring-primary/50 transition-all hover:border-primary/70"/>
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
                  <FormLabel className="text-lg font-semibold text-foreground/85 hover:text-primary transition-colors duration-200 flex items-center">
                    <ImageIcon className="mr-2.5 h-5 w-5 text-primary/80" />
                    Image URL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/your-product-image.jpg" {...field} className="text-base py-3 px-4 rounded-lg shadow-sm border-border/70 focus:border-primary focus:ring-primary/50 transition-all hover:border-primary/70"/>
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground/90 flex items-start gap-1.5 pt-1">
                    <Info size={16} className="text-muted-foreground/70 shrink-0 mt-0.5" />
                    <span>Optional. If left blank, a placeholder image will be automatically generated based on the product name.</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-2"> {/* Add some spacing before the button */}
              <Button type="submit" size="lg" className="w-full sm:w-auto py-3.5 px-10 text-lg font-semibold rounded-lg shadow-lg hover:shadow-primary/40 focus:shadow-primary/40 bg-primary text-primary-foreground focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 ease-in-out" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2.5 h-6 w-6 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2.5 h-6 w-6" />
                )}
                {isSubmitting ? 'Submitting...' : 'Add Product to Catalog'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
