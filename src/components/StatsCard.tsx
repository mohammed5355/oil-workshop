import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, className = '' }: StatsCardProps) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-white">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <span className="font-medium">{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span className="text-slate-500 mr-1">مقارنة بالأمس</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg">
          <Icon className="text-primary" size={24} />
        </div>
      </div>
    </div>
  );
}
