'use client';

import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import {
  LayoutDashboard,
  Users,
  Banknote,
  Truck,
  FileText,
  Search,
  Menu,
  X,
  Building2,
} from 'lucide-react';

import Dashboard from '@/components/syndic/dashboard';
import ClientManager from '@/components/syndic/client-manager';
import PaymentManager from '@/components/syndic/payment-manager';
import DeliveryManager from '@/components/syndic/delivery-manager';
import DeliveryLog from '@/components/syndic/delivery-log';
import Reports from '@/components/syndic/reports';
import SearchPage from '@/components/syndic/search-page';

type PageKey =
  | 'dashboard'
  | 'clients'
  | 'payments'
  | 'deliveries'
  | 'delivery-log'
  | 'reports'
  | 'search';

interface NavItem {
  key: PageKey;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard size={20} /> },
  { key: 'clients', label: 'العملاء', icon: <Users size={20} /> },
  { key: 'payments', label: 'المدفوعات', icon: <Banknote size={20} /> },
  { key: 'deliveries', label: 'التسليمات', icon: <Truck size={20} /> },
  { key: 'delivery-log', label: 'سجل التسليمات', icon: <FileText size={20} /> },
  { key: 'reports', label: 'التقارير', icon: <FileText size={20} /> },
  { key: 'search', label: 'البحث', icon: <Search size={20} /> },
];

export default function Home() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientManager />;
      case 'payments':
        return <PaymentManager />;
      case 'deliveries':
        return <DeliveryManager />;
      case 'delivery-log':
        return <DeliveryLog />;
      case 'reports':
        return <Reports />;
      case 'search':
        return <SearchPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="القائمة"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <Building2 size={28} className="text-emerald-600" />
            <h1 className="text-xl font-bold text-gray-800">إدارة السانديك</h1>
          </div>
        </div>
        <span className="text-sm text-gray-500 hidden sm:block">
          نظام متكامل لتسيير العمارة
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 right-0 top-0 z-50 w-64 bg-white border-l border-gray-200 transform transition-transform duration-200 ease-in-out pt-16 lg:pt-0 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <nav className="flex flex-col h-full py-4 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActivePage(item.key);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-r-4 ${
                  activePage === item.key
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderPage()}
        </main>
      </div>

      <Toaster />
      <SonnerToaster />
    </div>
  );
}