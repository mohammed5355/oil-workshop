'use client';

import React from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { AlertTriangle, Package } from 'lucide-react';

export default function StockAlertList() {
  const { getLowStockProducts } = useInventory();
  const lowStockProducts = getLowStockProducts();

  if (lowStockProducts.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="text-green-400" size={20} />
          <h3 className="text-lg font-semibold text-white">حالة المخزون</h3>
        </div>
        <p className="text-slate-400 text-sm">جميع المنتجات بمستويات مخزون صحية</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="text-red-400" size={20} />
        <h3 className="text-lg font-semibold text-white">تنبيهات المخزون المنخفض</h3>
        <span className="badge badge-low-stock mr-auto">{lowStockProducts.length}</span>
      </div>
      <div className="space-y-3">
        {lowStockProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-red-900/30"
          >
            <div>
              <p className="font-medium text-white text-sm">{product.name}</p>
              <p className="text-xs text-slate-400">
                الحد الأدنى: {product.minStockAlert}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-400">{product.currentStock}</p>
              <p className="text-xs text-slate-400">وحدة</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
