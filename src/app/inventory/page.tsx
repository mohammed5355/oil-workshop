'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import InventoryTable from '@/components/InventoryTable';
import ProductForm from '@/components/ProductForm';
import { Product } from '@/lib/types';
import { useInventory } from '@/contexts/InventoryContext';

export default function InventoryPage() {
  const { addProduct, updateProduct } = useInventory();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <MainLayout title="المخزون">
      <InventoryTable
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
      />

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </MainLayout>
  );
}
