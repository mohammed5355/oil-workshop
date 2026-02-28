'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  };

  const setToday = () => {
    const today = getTodayDate();
    onStartDateChange(today);
    onEndDateChange(today);
  };

  const setThisMonth = () => {
    onStartDateChange(getMonthStart());
    onEndDateChange(getTodayDate());
  };

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-slate-400" size={18} />
          <span className="text-sm font-medium text-slate-300">الفترة:</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="input-field w-auto"
          />
          <span className="text-slate-400">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="input-field w-auto"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={setToday}
            className="btn-secondary px-3 py-1.5 text-sm rounded-lg"
          >
            اليوم
          </button>
          <button
            onClick={setThisMonth}
            className="btn-secondary px-3 py-1.5 text-sm rounded-lg"
          >
            هذا الشهر
          </button>
        </div>
      </div>
    </div>
  );
}
