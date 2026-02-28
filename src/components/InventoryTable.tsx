'use client';

import React, { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Product, ProductType } from '@/lib/types';
import { Search, Plus, Edit2, Trash2, Package } from 'lucide-react';

interface InventoryTableProps {
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
}

export default function InventoryTable({ onAddProduct, onEditProduct }: InventoryTableProps) {
  const { products, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ProductType | 'all'>('all');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type: ProductType) => {
    const labels: Record<ProductType, string> = {
      oil: 'زيت',
      filter: 'فلتر',
      additive: 'إضافات',
    };
    return labels[type];
  };

  const getTypeBadgeClass = (type: ProductType) => {
    const classes: Record<ProductType, string> = {
      oil: 'badge-oil',
      filter: 'badge-filter',
      additive: 'badge-additive',
    };
    return classes[type];
  };

  const getStockBadgeClass = (current: number, min: number) => {
    return current <= min ? 'badge-low-stock' : 'badge-ok';
  };

  const getStockLabel = (current: number, min: number) => {
    return current <= min ? 'منخفض' : 'متوفر';
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف "${name}"؟`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-lg font-semibold text-white">المخزون ({products.length})</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="بحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pr-10 w-full sm:w-64"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ProductType | 'all')}
              className="input-field w-full sm:w-auto"
            >
              <option value="all">الكل</option>
              <option value="oil">زيوت</option>
              <option value="filter">فلاتر</option>
              <option value="additive">إضافات</option>
            </select>

            {/* Add Button */}
            <button
              onClick={onAddProduct}
              className="btn-primary px-4 py-2 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={18} />
              <span>إضافة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>المنتج</th>
              <th>النوع</th>
              <th>سعر الشراء</th>
              <th>سعر البيع</th>
              <th>المخزون</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Package className="text-slate-500" size={48} />
                    <p className="text-slate-400">لا توجد منتجات</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="font-medium text-white">{product.name}</td>
                  <td>
                    <span className={`badge ${getTypeBadgeClass(product.type)}`}>
                      {getTypeLabel(product.type)}
                    </span>
                  </td>
                  <td>{product.purchasePrice.toFixed(2)} ر.س</td>
                  <td>{product.sellingPrice.toFixed(2)} ر.س</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{product.currentStock}</span>
                      <span className={`badge ${getStockBadgeClass(product.currentStock, product.minStockAlert)} text-xs`}>
                        {getStockLabel(product.currentStock, product.minStockAlert)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditProduct?.(product)}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-800 rounded transition-colors"
                        title="تعديل"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
