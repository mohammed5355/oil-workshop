'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-800 rounded-full">
            <Home className="text-slate-400" size={48} />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">الصفحة غير موجودة</h1>
        <p className="text-slate-400 mb-8">عذراً، الصفحة التي تبحث عنها غير متوفرة</p>
        <Link
          href="/dashboard"
          className="btn-primary px-6 py-3 rounded-lg inline-flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span>العودة للرئيسية</span>
        </Link>
      </div>
    </div>
  );
}
