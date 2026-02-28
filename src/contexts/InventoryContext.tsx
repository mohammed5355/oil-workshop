'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductType } from '@/lib/types';
import {
  getProducts,
  setProducts,
  getProductById,
  seedInitialData,
} from '@/lib/storage';

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getProductsByType: (type: ProductType) => Product[];
  getLowStockProducts: () => Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProductsState] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize and seed data
    seedInitialData();
    setProductsState(getProducts());
    setIsInitialized(true);

    // Listen for storage changes
    const handleStorageChange = () => {
      setProductsState(getProducts());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    setProductsState(updatedProducts);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    setProducts(updatedProducts);
    setProductsState(updatedProducts);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    setProductsState(updatedProducts);
  };

  const getProduct = (id: string) => getProductById(id);

  const getProductsByType = (type: ProductType) => {
    return products.filter(p => p.type === type);
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.currentStock <= p.minStockAlert);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <InventoryContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        getProductsByType,
        getLowStockProducts,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
