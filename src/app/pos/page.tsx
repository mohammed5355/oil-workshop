'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import POSForm from '@/components/POSForm';
import POSReceipt from '@/components/POSReceipt';
import { Service } from '@/lib/types';

export default function POSPage() {
  const [completedService, setCompletedService] = useState<Service | null>(null);

  const handleServiceComplete = (service: Service) => {
    setCompletedService(service);
  };

  const handleCloseReceipt = () => {
    setCompletedService(null);
  };

  return (
    <MainLayout title="نقطة البيع">
      <div className="max-w-2xl mx-auto">
        <div className="card p-6">
          <div className="mb-6 pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">خدمة تغيير الزيت</h2>
            <p className="text-sm text-slate-400 mt-1">أدخل تفاصيل الخدمة الجديدة</p>
          </div>
          <POSForm onSuccess={handleServiceComplete} />
        </div>
      </div>

      {completedService && (
        <POSReceipt service={completedService} onClose={handleCloseReceipt} />
      )}
    </MainLayout>
  );
}
