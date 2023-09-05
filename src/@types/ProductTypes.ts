export type ProductType = {
  slug: string;
  title: string;
  price: number;
  stock: number;
  description: string;
  gender: string;
  is_active: boolean;
  images: string;
  category: string;
  availableSize: Array<{
    sizeValue: string;
    quantity: number;
  }>;
  status: string;
  createdAt: number;
  updatedAt: number;
};
