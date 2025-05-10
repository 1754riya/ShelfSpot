export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  dataAiHint?: string; // Changed from "data-ai-hint" to dataAiHint for consistency
}
