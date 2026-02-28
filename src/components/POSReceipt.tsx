'use client';

import React, { useRef } from 'react';
import { X, Printer, Share2 } from 'lucide-react';
import { Service } from '@/lib/types';
import { useSettings } from '@/contexts/SettingsContext';

interface POSReceiptProps {
  service: Service;
  onClose: () => void;
}

export default function POSReceipt({ service, onClose }: POSReceiptProps) {
  const { settings } = useSettings();
  const receiptRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const receiptText = `
${settings.companyName}
${settings.companyAddress}
${settings.companyPhone}

رقم اللوحة: ${service.carPlateNumber}
الزيت: ${service.oilBrand} (${service.oilLiters} لتر)
الفلتر: ${service.filterType}
العمالة: ${service.laborCost} ر.س

الإجمالي: ${service.totalPrice.toFixed(2)} ر.س

التاريخ: ${formatDate(service.createdAt)}
    `;

    try {
      await navigator.clipboard.writeText(receiptText);
      alert('تم نسخ الفاتورة');
    } catch (error) {
      alert('فشل نسخ الفاتورة');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content max-w-sm mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-lg font-bold text-white">فاتورة الخدمة</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Receipt Content */}
          <div ref={receiptRef} className="receipt-print bg-slate-800 p-4 rounded-lg text-right">
            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-slate-600">
              <h3 className="text-xl font-bold text-white mb-1">{settings.companyName}</h3>
              {settings.companyAddress && (
                <p className="text-sm text-slate-400">{settings.companyAddress}</p>
              )}
              {settings.companyPhone && (
                <p className="text-sm text-slate-400">{settings.companyPhone}</p>
              )}
              <p className="text-xs text-slate-500 mt-2">{formatDate(service.createdAt)}</p>
            </div>

            {/* Service Details */}
            <div className="space-y-2 mb-6 pb-4 border-b-2 border-dashed border-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">رقم اللوحة</span>
                <span className="text-white font-medium">{service.carPlateNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">الزيت</span>
                <span className="text-white font-medium">
                  {service.oilBrand} ({service.oilLiters} لتر)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">الفلتر</span>
                <span className="text-white font-medium">{service.filterType}</span>
              </div>
            </div>

            {/* Items */}
            {service.itemsUsed.length > 0 && (
              <div className="space-y-2 mb-6 pb-4 border-b-2 border-dashed border-slate-600">
                {service.itemsUsed.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {item.productName} x{item.quantity}
                    </span>
                    <span className="text-white">
                      {(item.sellingPrice * item.quantity).toFixed(2)} ر.س
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>العمالة</span>
                <span>{service.laborCost.toFixed(2)} ر.س</span>
              </div>
              {settings.taxRate > 0 && (
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>الضريبة ({settings.taxRate}%)</span>
                  <span>
                    {((service.totalPrice / (1 + settings.taxRate / 100)) * (settings.taxRate / 100)).toFixed(2)} ر.س
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-slate-600">
                <span>الإجمالي</span>
                <span className="text-primary">{service.totalPrice.toFixed(2)} ر.س</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-slate-600">
              <p className="text-xs text-slate-500">شكراً لتعاملكم معنا</p>
              <p className="text-xs text-slate-500 mt-1">{settings.companyName}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-footer">
          <button
            onClick={handleShare}
            className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Share2 size={18} />
            <span>نسخ</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Printer size={18} />
            <span>طباعة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
