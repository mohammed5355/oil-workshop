export type ProductType = 'oil' | 'filter' | 'additive';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockAlert: number;
  createdAt: string;
}

export interface ServiceItem {
  productId: string;
  quantity: number;
  productName: string;
  purchasePrice: number;
  sellingPrice: number;
}

export interface Service {
  id: string;
  carPlateNumber: string;
  oilBrand: string;
  oilLiters: number;
  filterType: string;
  laborCost: number;
  totalPrice: number;
  itemsUsed: ServiceItem[];
  createdAt: string;
}

export interface Settings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  taxRate: number;
}

export interface DashboardStats {
  todaySales: number;
  carsServed: number;
  lowStockCount: number;
}
