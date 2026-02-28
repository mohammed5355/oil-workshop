'use client';

import React from 'react';
import MainLayout from '@/components/MainLayout';
import StatsCard from '@/components/StatsCard';
import StockAlertList from '@/components/StockAlertList';
import { useSales } from '@/contexts/SalesContext';
import { useInventory } from '@/contexts/InventoryContext';
import {
  DollarSign,
  Car,
  TrendingUp,
  ShoppingCart,
  ArrowLeft,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { getTodaySales, getCarsServedToday } = useSales();
  const { getLowStockProducts, products } = useInventory();

  const todaySales = getTodaySales();
  const carsServed = getCarsServedToday();
  const lowStockCount = getLowStockProducts().length;

  return (
    <MainLayout title="لوحة التحكم">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/pos"
            className="card p-6 hover:border-primary/50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg group-hover:scale-110 transition-transform">
                <PlusCircle className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">خدمة جديدة</h3>
                <p className="text-sm text-slate-400">إضافة تغيير زيت جديد</p>
              </div>
              <ArrowLeft className="text-slate-500 mr-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/reports"
            className="card p-6 hover:border-primary/50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-slate-700 rounded-lg group-hover:scale-110 transition-transform">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">عرض المبيعات</h3>
                <p className="text-sm text-slate-400">عرض جميع المعاملات</p>
              </div>
              <ArrowLeft className="text-slate-500 mr-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <StatsCard
            title="مبيعات اليوم"
            value={`${todaySales.toFixed(2)} ر.س`}
            icon={DollarSign}
          />
          <StatsCard
            title="عدد السيارات"
            value={carsServed}
            icon={Car}
          />
          <StatsCard
            title="تنبيهات المخزون"
            value={lowStockCount}
            icon={TrendingUp}
            className={lowStockCount > 0 ? 'border-red-900/50' : ''}
          />
        </div>

        {/* Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StockAlertList />

          {/* Recent Products */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">إجمالي المنتجات</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-amber-400">
                  {products.filter(p => p.type === 'oil').length}
                </p>
                <p className="text-sm text-slate-400 mt-1">زيوت</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-blue-400">
                  {products.filter(p => p.type === 'filter').length}
                </p>
                <p className="text-sm text-slate-400 mt-1">فلاتر</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-purple-400">
                  {products.filter(p => p.type === 'additive').length}
                </p>
                <p className="text-sm text-slate-400 mt-1">إضافات</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
