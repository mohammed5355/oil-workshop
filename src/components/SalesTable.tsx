'use client';

import React from 'react';
import { Service } from '@/lib/types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SalesTableProps {
  services: Service[];
}

export default function SalesTable({ services }: SalesTableProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy - HH:mm', { locale: ar });
  };

  return (
    <div className="card">
      <div className="p-4 border-b border-slate-800">
        <h3 className="font-semibold text-white">سجل المبيعات ({services.length})</h3>
      </div>
      <div className="table-container max-h-96 overflow-y-auto">
        <table className="data-table">
          <thead className="sticky top-0 bg-slate-800">
            <tr>
              <th>التاريخ</th>
              <th>رقم اللوحة</th>
              <th>الزيت</th>
              <th>الفلتر</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <p className="text-slate-400">لا توجد مبيعات</p>
                </td>
              </tr>
            ) : (
              services
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((service) => (
                  <tr key={service.id}>
                    <td className="text-slate-300">{formatDate(service.createdAt)}</td>
                    <td className="font-medium text-white">{service.carPlateNumber}</td>
                    <td className="text-slate-300">{service.oilBrand}</td>
                    <td className="text-slate-300">{service.filterType}</td>
                    <td className="font-medium text-primary">
                      {service.totalPrice.toFixed(2)} ر.س
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
