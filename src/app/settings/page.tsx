'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useSettings } from '@/contexts/SettingsContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, Phone, MapPin, Percent, Download, Trash2 } from 'lucide-react';

const settingsSchema = z.object({
  companyName: z.string().min(1, 'اسم الشركة مطلوب'),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  taxRate: z.string().min(0, 'نسبة الضريبة يجب أن تكون 0 أو أكبر'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: settings.companyName,
      companyAddress: settings.companyAddress,
      companyPhone: settings.companyPhone,
      taxRate: settings.taxRate.toString(),
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    updateSettings({
      companyName: data.companyName,
      companyAddress: data.companyAddress || '',
      companyPhone: data.companyPhone || '',
      taxRate: parseFloat(data.taxRate),
    });
  };

  const handleExportData = () => {
    const data = {
      products: localStorage.getItem('oil_workshop_products'),
      services: localStorage.getItem('oil_workshop_services'),
      settings: localStorage.getItem('oil_workshop_settings'),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oil-workshop-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (showResetConfirm) {
      localStorage.removeItem('oil_workshop_products');
      localStorage.removeItem('oil_workshop_services');
      localStorage.removeItem('oil_workshop_settings');
      window.location.reload();
    } else {
      setShowResetConfirm(true);
    }
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  return (
    <MainLayout title="الإعدادات">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Company Information */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Building2 className="text-primary" size={20} />
            معلومات الشركة
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="input-label">اسم الشركة *</label>
              <input
                type="text"
                placeholder="مثال: ورشة تغيير الزيت"
                className={`input-field ${errors.companyName ? 'border-red-500' : ''}`}
                {...register('companyName')}
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-400">{errors.companyName.message}</p>
              )}
            </div>

            {/* Company Address */}
            <div>
              <label className="input-label flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" />
                العنوان
              </label>
              <input
                type="text"
                placeholder="عنوان الشركة"
                className="input-field"
                {...register('companyAddress')}
              />
            </div>

            {/* Company Phone */}
            <div>
              <label className="input-label flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                رقم الهاتف
              </label>
              <input
                type="tel"
                placeholder="رقم الهاتف"
                className="input-field"
                {...register('companyPhone')}
              />
            </div>

            {/* Tax Rate */}
            <div>
              <label className="input-label flex items-center gap-2">
                <Percent size={16} className="text-slate-400" />
                نسبة الضريبة (%) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="15"
                className={`input-field ${errors.taxRate ? 'border-red-500' : ''}`}
                {...register('taxRate')}
              />
              {errors.taxRate && (
                <p className="mt-1 text-sm text-red-400">{errors.taxRate.message}</p>
              )}
            </div>

            {/* Submit Button */}
            {isDirty && (
              <button
                type="submit"
                className="btn-primary px-6 py-2.5 rounded-lg"
              >
                حفظ التغييرات
              </button>
            )}
          </form>
        </div>

        {/* Data Management */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">إدارة البيانات</h2>

          <div className="space-y-4">
            {/* Export Data */}
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg">
                  <Download className="text-blue-400" size={20} />
                </div>
                <div>
                  <p className="font-medium text-white">تصدير البيانات</p>
                  <p className="text-sm text-slate-400">حفظ نسخة احتياطية من جميع البيانات</p>
                </div>
              </div>
              <button
                onClick={handleExportData}
                className="btn-secondary px-4 py-2 rounded-lg"
              >
                تصدير
              </button>
            </div>

            {/* Reset Data */}
            <div className={`flex items-center justify-between p-4 bg-slate-800/50 rounded-lg ${showResetConfirm ? 'border border-red-900/50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${showResetConfirm ? 'bg-red-500/20' : 'bg-red-500/10'}`}>
                  <Trash2 className={`size-5 ${showResetConfirm ? 'text-red-400' : 'text-red-400/70'}`} size={20} />
                </div>
                <div>
                  <p className="font-medium text-white">حذف جميع البيانات</p>
                  <p className="text-sm text-slate-400">مسح جميع البيانات والعودة للإعدادات الافتراضية</p>
                </div>
              </div>
              {!showResetConfirm ? (
                <button
                  onClick={handleResetData}
                  className="btn-danger px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={cancelReset}
                    className="btn-secondary px-4 py-2 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleResetData}
                    className="btn-danger px-4 py-2 rounded-lg"
                  >
                    تأكيد الحذف
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="card p-4 text-center">
          <p className="text-sm text-slate-500">
            جميع البيانات محفوظة محلياً على جهازك
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
