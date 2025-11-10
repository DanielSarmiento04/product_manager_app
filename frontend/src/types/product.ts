export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}