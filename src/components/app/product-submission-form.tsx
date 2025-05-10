
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
import { PlusCircle, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { generateProductDescription, type GenerateProductDescriptionInput } from '@/ai/flows/generate-product-description';
import { useToast } from '@/hooks/use-toast';

const productFormSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }).max(100, { message: 'Product name must be at most 100 characters.'}),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(5000, { message: 'Description must be at most 5000 characters.'}),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  dataAiHint: z.string().max(50, {message: 'AI hint must be at most 50 characters (e.g., "modern lamp").'}).optional().or(z.literal('')),
  keywords: z.string().max(100, { message: 'Keywords must be at most 100 characters.'}).optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductSubmissionFormProps {
  onAddProduct: (productData: Omit<Product, 'id'>) => Promise<boolean>;
}

export function ProductSubmissionForm({ onAddProduct }: ProductSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      dataAiHint: '',
      keywords: '',
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

  const handleGenerateDescription = async () => {
    const productName = form.getValues("name");
    const keywords = form.getValues("keywords");

    if (!productName && !keywords) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a product name or some keywords to generate a description.",
      });
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const input: GenerateProductDescriptionInput = { 
        productName: productName || "", 
        keywords: keywords || ""
      };
      const result = await generateProductDescription(input);
      form.setValue("description", result.description, { shouldValidate: true });
      toast({
        title: "Description Generated!",
        description: "The AI has crafted a description for your product.",
      });
    } catch (error) {
      console.error("Failed to generate description:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate a product description. Please try again.",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };


  return (
    <Card className="max-w-3xl mx-auto shadow-xl rounded-xl">
      <CardHeader className="p-6 sm:p-8">
        <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Add a New Product</CardTitle>
        <CardDescription className="text-base text-muted-foreground mt-1 sm:mt-2">
          Fill in the details below to add your product to the catalog. You can also use AI to help generate a compelling description!
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
                  <FormLabel className="text-lg font-semibold">Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ergonomic Office Chair" {...field} className="text-base py-3 px-4 rounded-lg shadow-sm"/>
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
                  <FormLabel className="text-lg font-semibold">Price (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 299.99" {...field} step="0.01" 
                     onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                     className="text-base py-3 px-4 rounded-lg shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
                <FormLabel className="text-lg font-semibold">AI Description Helper</FormLabel>
                <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                        <FormItem className="mb-0">
                        <FormControl>
                            <Input placeholder="Keywords for AI (e.g., comfortable, leather, modern)" {...field} className="text-base py-3 px-4 rounded-lg shadow-sm"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormDescription className="text-sm">
                    Enter keywords (or use Product Name) and let AI generate a description for you.
                </FormDescription>
                 <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGenerateDescription} 
                    disabled={isGeneratingDescription || !form.getValues("name") && !form.getValues("keywords")}
                    className="w-full sm:w-auto gap-2"
                    >
                    {isGeneratingDescription ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Sparkles className="text-accent" />
                    )}
                    Generate with AI
                </Button>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your product in detail..." {...field} rows={6} className="text-base py-3 px-4 rounded-lg shadow-sm min-h-[120px]"/>
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
                  <FormLabel className="text-lg font-semibold">Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/your-product-image.jpg" {...field} className="text-base py-3 px-4 rounded-lg shadow-sm"/>
                  </FormControl>
                  <FormDescription className="text-sm">Enter the full URL of the product image. If left blank, a placeholder will be used.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataAiHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Placeholder Image Keywords (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., desk lamp" {...field} className="text-base py-3 px-4 rounded-lg shadow-sm"/>
                  </FormControl>
                  <FormDescription className="text-sm">Max 2 words for placeholder image generation if no Image URL is provided (e.g., "modern chair").</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto py-3.5 px-8 text-lg font-medium rounded-lg shadow-md hover:bg-primary/90 transition-all duration-150 ease-in-out" disabled={isSubmitting}>
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

    