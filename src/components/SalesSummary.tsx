'use client';

import React from 'react';
import { Service } from '@/lib/types';
import { DollarSign, TrendingUp, ShoppingCart, Car } from 'lucide-react';

interface SalesSummaryProps {
  services: Service[];
}

export default function SalesSummary({ services }: SalesSummaryProps) {
  // Calculate totals
  const totalRevenue = services.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalCars = services.length;

  // Calculate cost of goods sold
  const totalCost = services.reduce((sum, s) => {
    const itemsCost = s.itemsUsed.reduce(
      (itemSum, item) => itemSum + item.purchasePrice * item.quantity,
      0
    );
    return sum + itemsCost + s.laborCost;
  }, 0);

  // Calculate profit before tax
  const grossProfit = totalRevenue - totalCost;

  // Calculate tax
  const tax = services.reduce((sum, s) => {
    // Reverse calculate tax from total
    const itemsRevenue = s.itemsUsed.reduce(
      (itemSum, item) => itemSum + item.sellingPrice * item.quantity,
      0
    );
    const subtotal = itemsRevenue + s.laborCost;
    return sum + (s.totalPrice - subtotal);
  }, 0);

  // Net profit (after tax)
  const netProfit = grossProfit - tax;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Total Revenue */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">إجمالي المبيعات</p>
            <p className="text-2xl font-bold text-white">{totalRevenue.toFixed(2)} ر.س</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg">
            <DollarSign className="text-primary" size={24} />
          </div>
        </div>
      </div>

      {/* Gross Profit */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">الربح الإجمالي</p>
            <p className={`text-2xl font-bold ${grossProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {grossProfit.toFixed(2)} ر.س
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg">
            <TrendingUp className="text-green-400" size={24} />
          </div>
        </div>
      </div>

      {/* Total Cost */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">إجمالي التكاليف</p>
            <p className="text-2xl font-bold text-slate-300">{totalCost.toFixed(2)} ر.س</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-lg">
            <ShoppingCart className="text-red-400" size={24} />
          </div>
        </div>
      </div>

      {/* Cars Served */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">عدد السيارات</p>
            <p className="text-2xl font-bold text-white">{totalCars}</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg">
            <Car className="text-blue-400" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
