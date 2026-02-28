'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useInventory } from '@/contexts/InventoryContext';
import { useSales } from '@/contexts/SalesContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Product, ProductType } from '@/lib/types';
import { X, Loader2 } from 'lucide-react';

const serviceSchema = z.object({
  carPlateNumber: z.string().min(1, 'رقم اللوحة مطلوب'),
  oilProductId: z.string().min(1, 'اختر نوع الزيت'),
  oilLiters: z.string().min(1, 'عدد اللترات مطلوب'),
  filterProductId: z.string().min(1, 'اختر نوع الفلتر'),
  laborCost: z.string().min(1, 'تكلفة العمالة مطلوبة'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface POSFormProps {
  onSuccess?: (service: any) => void;
}

export default function POSForm({ onSuccess }: POSFormProps) {
  const { products, updateProduct, getProductsByType, getProduct } = useInventory();
  const { addService } = useSales();
  const { settings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOil, setSelectedOil] = useState<Product | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      laborCost: '30',
      oilLiters: '4',
    },
  });

  const oilProducts = getProductsByType('oil');
  const filterProducts = getProductsByType('filter');

  const watchedOilId = watch('oilProductId');
  const watchedFilterId = watch('filterProductId');
  const watchedOilLiters = watch('oilLiters');
  const watchedLaborCost = watch('laborCost');

  // Update selected products when dropdown changes
  React.useEffect(() => {
    if (watchedOilId) {
      setSelectedOil(getProduct(watchedOilId) || null);
    }
    if (watchedFilterId) {
      setSelectedFilter(getProduct(watchedFilterId) || null);
    }
  }, [watchedOilId, watchedFilterId, getProduct]);

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    const oilLiters = parseFloat(watchedOilLiters) || 0;
    const laborCost = parseFloat(watchedLaborCost) || 0;

    if (selectedOil) {
      total += selectedOil.sellingPrice * oilLiters;
    }
    if (selectedFilter) {
      total += selectedFilter.sellingPrice;
    }

    // Add tax
    const taxAmount = total * (settings.taxRate / 100);
    total += taxAmount;

    return total.toFixed(2);
  };

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);

    try {
      const oilLiters = parseFloat(data.oilLiters);
      const laborCost = parseFloat(data.laborCost);

      const itemsUsed: any[] = [];

      // Process oil
      if (selectedOil) {
        if (selectedOil.currentStock < oilLiters) {
          alert(`المخزون غير كافٍ للزيت "${selectedOil.name}". المتوفر: ${selectedOil.currentStock}`);
          setIsSubmitting(false);
          return;
        }
        itemsUsed.push({
          productId: selectedOil.id,
          productName: selectedOil.name,
          quantity: oilLiters,
          purchasePrice: selectedOil.purchasePrice,
          sellingPrice: selectedOil.sellingPrice,
        });
        updateProduct(selectedOil.id, {
          currentStock: selectedOil.currentStock - oilLiters,
        });
      }

      // Process filter
      if (selectedFilter) {
        if (selectedFilter.currentStock < 1) {
          alert(`المخزون غير كافٍ للفلتر "${selectedFilter.name}". المتوفر: ${selectedFilter.currentStock}`);
          setIsSubmitting(false);
          return;
        }
        itemsUsed.push({
          productId: selectedFilter.id,
          productName: selectedFilter.name,
          quantity: 1,
          purchasePrice: selectedFilter.purchasePrice,
          sellingPrice: selectedFilter.sellingPrice,
        });
        updateProduct(selectedFilter.id, {
          currentStock: selectedFilter.currentStock - 1,
        });
      }

      // Create service
      const service = {
        carPlateNumber: data.carPlateNumber,
        oilBrand: selectedOil?.name || '',
        oilLiters: oilLiters,
        filterType: selectedFilter?.name || '',
        laborCost: laborCost,
        totalPrice: parseFloat(calculateTotal()),
        itemsUsed,
      };

      addService(service);
      onSuccess?.(service);
      reset();
      setSelectedOil(null);
      setSelectedFilter(null);
    } catch (error) {
      console.error('Error creating service:', error);
      alert('حدث خطأ أثناء إنشاء الخدمة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = (type: ProductType) => {
    const labels: Record<ProductType, string> = {
      oil: 'زيت',
      filter: 'فلتر',
      additive: 'إضافات',
    };
    return labels[type];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Car Plate Number */}
      <div>
        <label className="input-label">رقم اللوحة *</label>
        <input
          type="text"
          placeholder="مثال: أ ب ج 1234"
          className={`input-field ${errors.carPlateNumber ? 'border-red-500' : ''}`}
          {...register('carPlateNumber')}
        />
        {errors.carPlateNumber && (
          <p className="mt-1 text-sm text-red-400">{errors.carPlateNumber.message}</p>
        )}
      </div>

      {/* Oil Selection */}
      <div>
        <label className="input-label">نوع الزيت *</label>
        <select
          className={`input-field ${errors.oilProductId ? 'border-red-500' : ''}`}
          {...register('oilProductId')}
        >
          <option value="">اختر نوع الزيت</option>
          {oilProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - {product.sellingPrice} ر.س/لتر ({product.currentStock} متوفر)
            </option>
          ))}
        </select>
        {errors.oilProductId && (
          <p className="mt-1 text-sm text-red-400">{errors.oilProductId.message}</p>
        )}
      </div>

      {/* Oil Liters */}
      <div>
        <label className="input-label">عدد اللترات *</label>
        <input
          type="number"
          step="0.5"
          min="1"
          className={`input-field ${errors.oilLiters ? 'border-red-500' : ''}`}
          {...register('oilLiters')}
        />
        {errors.oilLiters && (
          <p className="mt-1 text-sm text-red-400">{errors.oilLiters.message}</p>
        )}
      </div>

      {/* Filter Selection */}
      <div>
        <label className="input-label">نوع الفلتر *</label>
        <select
          className={`input-field ${errors.filterProductId ? 'border-red-500' : ''}`}
          {...register('filterProductId')}
        >
          <option value="">اختر نوع الفلتر</option>
          {filterProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - {product.sellingPrice} ر.س ({product.currentStock} متوفر)
            </option>
          ))}
        </select>
        {errors.filterProductId && (
          <p className="mt-1 text-sm text-red-400">{errors.filterProductId.message}</p>
        )}
      </div>

      {/* Labor Cost */}
      <div>
        <label className="input-label">تكلفة العمالة (ر.س) *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className={`input-field ${errors.laborCost ? 'border-red-500' : ''}`}
          {...register('laborCost')}
        />
        {errors.laborCost && (
          <p className="mt-1 text-sm text-red-400">{errors.laborCost.message}</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="card p-4 bg-slate-800/30">
        <h3 className="font-semibold text-white mb-3">ملخص الطلب</h3>
        <div className="space-y-2 text-sm">
          {selectedOil && (
            <div className="flex justify-between text-slate-300">
              <span>{selectedOil.name} x {watchedOilLiters} لتر</span>
              <span>{(selectedOil.sellingPrice * parseFloat(watchedOilLiters || '0')).toFixed(2)} ر.س</span>
            </div>
          )}
          {selectedFilter && (
            <div className="flex justify-between text-slate-300">
              <span>{selectedFilter.name}</span>
              <span>{selectedFilter.sellingPrice.toFixed(2)} ر.س</span>
            </div>
          )}
          {watchedLaborCost && (
            <div className="flex justify-between text-slate-300">
              <span>تكلفة العمالة</span>
              <span>{parseFloat(watchedLaborCost).toFixed(2)} ر.س</span>
            </div>
          )}
          {settings.taxRate > 0 && (
            <div className="flex justify-between text-slate-400">
              <span>الضريبة ({settings.taxRate}%)</span>
              <span>{((parseFloat(calculateTotal()) / (1 + settings.taxRate / 100)) * (settings.taxRate / 100)).toFixed(2)} ر.س</span>
            </div>
          )}
          <div className="border-t border-slate-700 pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold text-white">
              <span>الإجمالي</span>
              <span className="text-primary">{calculateTotal()} ر.س</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>جاري المعالجة...</span>
          </>
        ) : (
          <>
            <span>إتمام العملية</span>
          </>
        )}
      </button>
    </form>
  );
}
