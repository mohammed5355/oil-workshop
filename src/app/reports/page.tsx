'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import SalesTable from '@/components/SalesTable';
import SalesSummary from '@/components/SalesSummary';
import DateRangePicker from '@/components/DateRangePicker';
import { useSales } from '@/contexts/SalesContext';

export default function ReportsPage() {
  const { services, getServicesByDateRange, getTodayServices, getMonthlySales } = useSales();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);

  // Initialize with this month
  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    setStartDate(startOfMonth.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  // Update filtered services when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      setFilteredServices(getServicesByDateRange(startDate, endDate));
    }
  }, [startDate, endDate, getServicesByDateRange]);

  return (
    <MainLayout title="التقارير">
      <div className="space-y-6">
        {/* Date Range Picker */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {/* Sales Summary */}
        <SalesSummary services={filteredServices} />

        {/* Sales Table */}
        <SalesTable services={filteredServices} />
      </div>
    </MainLayout>
  );
}
