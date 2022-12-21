export interface Product {
  id: string;
  attributes: string[];
  category: string;
  createdAt: number;
  currency: string;
  image: string | null;
  inStock: boolean;
  isAvailable: boolean;
  isShippable: boolean;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  status: 'published' | 'draft';
  updatedAt: number;
  variants: number;
}
