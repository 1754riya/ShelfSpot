export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  "data-ai-hint"?: string; // Make data-ai-hint optional
}
