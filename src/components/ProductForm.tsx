'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product, ProductType } from '@/lib/types';
import { X } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'اسم المنتج مطلوب'),
  type: z.enum(['oil', 'filter', 'additive']),
  purchasePrice: z.string().min(1, 'سعر الشراء مطلوب'),
  sellingPrice: z.string().min(1, 'سعر البيع مطلوب'),
  currentStock: z.string().min(1, 'الكمية الحالية مطلوبة'),
  minStockAlert: z.string().min(1, 'حد التنبيه مطلوب'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          type: product.type,
          purchasePrice: product.purchasePrice.toString(),
          sellingPrice: product.sellingPrice.toString(),
          currentStock: product.currentStock.toString(),
          minStockAlert: product.minStockAlert.toString(),
        }
      : {
          type: 'oil',
        },
  });

  const getTypeLabel = (type: ProductType) => {
    const labels: Record<ProductType, string> = {
      oil: 'زيت',
      filter: 'فلتر',
      additive: 'إضافات',
    };
    return labels[type];
  };

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit({
      name: data.name,
      type: data.type,
      purchasePrice: parseFloat(data.purchasePrice),
      sellingPrice: parseFloat(data.sellingPrice),
      currentStock: parseInt(data.currentStock),
      minStockAlert: parseInt(data.minStockAlert),
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-lg font-bold text-white">
            {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form id="product-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="input-label">اسم المنتج *</label>
              <input
                type="text"
                placeholder="مثال: زيت محرك موبيل 1"
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Product Type */}
            <div>
              <label className="input-label">النوع *</label>
              <select
                className={`input-field ${errors.type ? 'border-red-500' : ''}`}
                {...register('type')}
              >
                <option value="oil">{getTypeLabel('oil')}</option>
                <option value="filter">{getTypeLabel('filter')}</option>
                <option value="additive">{getTypeLabel('additive')}</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Purchase Price */}
              <div>
                <label className="input-label">سعر الشراء (ر.س) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={`input-field ${errors.purchasePrice ? 'border-red-500' : ''}`}
                  {...register('purchasePrice')}
                />
                {errors.purchasePrice && (
                  <p className="mt-1 text-sm text-red-400">{errors.purchasePrice.message}</p>
                )}
              </div>

              {/* Selling Price */}
              <div>
                <label className="input-label">سعر البيع (ر.س) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={`input-field ${errors.sellingPrice ? 'border-red-500' : ''}`}
                  {...register('sellingPrice')}
                />
                {errors.sellingPrice && (
                  <p className="mt-1 text-sm text-red-400">{errors.sellingPrice.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Current Stock */}
              <div>
                <label className="input-label">الكمية الحالية *</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="0"
                  className={`input-field ${errors.currentStock ? 'border-red-500' : ''}`}
                  {...register('currentStock')}
                />
                {errors.currentStock && (
                  <p className="mt-1 text-sm text-red-400">{errors.currentStock.message}</p>
                )}
              </div>

              {/* Min Stock Alert */}
              <div>
                <label className="input-label">حد التنبيه *</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="10"
                  className={`input-field ${errors.minStockAlert ? 'border-red-500' : ''}`}
                  {...register('minStockAlert')}
                />
                {errors.minStockAlert && (
                  <p className="mt-1 text-sm text-red-400">{errors.minStockAlert.message}</p>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary px-4 py-2 rounded-lg"
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="product-form"
            className="btn-primary px-4 py-2 rounded-lg"
          >
            {product ? 'حفظ التغييرات' : 'إضافة'}
          </button>
        </div>
      </div>
    </div>
  );
}
