'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Banknote,
  Truck,
  Wallet,
  Building,
  Store,
  Users,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { DashboardStats } from '@/lib/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.error && !data.totalCollected && data.totalCollected !== 0) {
        setError(data.error);
      } else {
        setStats(data);
      }
    } catch {
      setError('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">تنبيه</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <p className="text-sm text-gray-400">
          يرجى إعداد متغيرات Firebase في ملف .env.local
        </p>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'إجمالي المحصل',
      value: `${stats.totalCollected.toLocaleString()} درهم`,
      icon: <Banknote size={24} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'إجمالي المسلم',
      value: `${stats.totalDelivered.toLocaleString()} درهم`,
      icon: <Truck size={24} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'الرصيد الحالي',
      value: `${stats.currentBalance.toLocaleString()} درهم`,
      icon: <Wallet size={24} />,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'عدد الشقق',
      value: stats.totalApartments.toString(),
      icon: <Building size={24} />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'عدد المحلات',
      value: stats.totalShops.toString(),
      icon: <Store size={24} />,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      title: 'إجمالي العملاء',
      value: stats.totalClients.toString(),
      icon: <Users size={24} />,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-lg font-bold text-gray-800">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">التحصيل الشهري - {new Date().getFullYear()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="monthName"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis fontSize={12} tickLine={false} />
                  <Tooltip
                    formatter={(value: number) => `${value.toLocaleString()} درهم`}
                    contentStyle={{ direction: 'rtl' }}
                  />
                  <Legend
                    formatter={(value) =>
                      value === 'collected' ? 'المحصل' : 'المسلم'
                    }
                  />
                  <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} name="collected" />
                  <Bar dataKey="delivered" fill="#3b82f6" radius={[4, 4, 0, 0]} name="delivered" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Yearly Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">التحصيل السنوي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis fontSize={12} tickLine={false} />
                  <Tooltip
                    formatter={(value: number) => `${value.toLocaleString()} درهم`}
                    contentStyle={{ direction: 'rtl' }}
                  />
                  <Legend
                    formatter={(value) =>
                      value === 'collected' ? 'المحصل' : 'المسلم'
                    }
                  />
                  <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} name="collected" />
                  <Bar dataKey="delivered" fill="#3b82f6" radius={[4, 4, 0, 0]} name="delivered" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Late Clients */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            العملاء المتأخرون ({stats.lateClients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.lateClients.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              لا يوجد عملاء متأخرون حاليا
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {stats.lateClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-800">{client.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {client.apartmentNumber}
                      </Badge>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        client.propertyType === 'apartment'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-orange-100 text-orange-700'
                      }
                    >
                      {client.propertyType === 'apartment' ? 'شقة' : 'محل'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}