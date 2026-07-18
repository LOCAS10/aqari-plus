'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileSpreadsheet, FileText, Download, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Delivery, Client } from '@/lib/types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ITEMS_PER_PAGE = 20;

const MONTHS = [
  { value: '1', label: 'يناير' },
  { value: '2', label: 'فبراير' },
  { value: '3', label: 'مارس' },
  { value: '4', label: 'أبريل' },
  { value: '5', label: 'ماي' },
  { value: '6', label: 'يونيو' },
  { value: '7', label: 'يوليوز' },
  { value: '8', label: 'غشت' },
  { value: '9', label: 'شتنبر' },
  { value: '10', label: 'أكتوبر' },
  { value: '11', label: 'نونبر' },
  { value: '12', label: 'دجنبر' },
];

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const years: { value: string; label: string }[] = [];
  for (let y = currentYear - 3; y <= currentYear + 1; y++) {
    years.push({ value: String(y), label: String(y) });
  }
  return years;
}

export default function DeliveryLog() {
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [filterClientId, setFilterClientId] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>(String(new Date().getFullYear()));

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (Array.isArray(data)) {
        setClients(data);
      }
    } catch {
      // silent
    }
  }, []);

  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterClientId && filterClientId !== 'all') params.set('clientId', filterClientId);
      if (filterMonth && filterMonth !== 'all') params.set('month', filterMonth);
      if (filterYear) params.set('year', filterYear);

      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/deliveries${query}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setDeliveries(data);
        setVisibleCount(ITEMS_PER_PAGE);
      }
    } catch {
      toast({ title: 'فشل في تحميل التسليمات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [filterClientId, filterMonth, filterYear, toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const visibleDeliveries = deliveries.slice(0, visibleCount);
  const hasMore = visibleCount < deliveries.length;
  const totalAmount = deliveries.reduce((sum, d) => sum + d.amount, 0);

  const handleExportExcel = () => {
    if (deliveries.length === 0) {
      toast({ title: 'لا يوجد بيانات للتصدير', variant: 'destructive' });
      return;
    }

    const rows = deliveries.map((d) => ({
      'التاريخ': new Date(d.deliveryDate).toLocaleDateString('ar-MA'),
      'اسم العميل': d.clientName || '',
      'الشقة': d.clientApartment || '',
      'النوع': d.clientPropertyType === 'apartment' ? 'شقة' : 'محل',
      'المبلغ': d.amount,
      'الوصف': d.description || '',
      'ملاحظات': d.notes || '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'التسليمات');
    XLSX.writeFile(wb, 'سجل-التسليمات.xlsx');
    toast({ title: 'تم تصدير الملف بنجاح' });
  };

  const handleExportPDF = () => {
    if (deliveries.length === 0) {
      toast({ title: 'لا يوجد بيانات للتصدير', variant: 'destructive' });
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const tableData = deliveries.map((d) => [
      new Date(d.deliveryDate).toLocaleDateString('ar-MA'),
      d.clientName || '',
      d.clientApartment || '',
      d.clientPropertyType === 'apartment' ? 'شقة' : 'محل',
      d.amount.toLocaleString() + ' درهم',
      d.description || '',
      d.notes || '',
    ]);

    autoTable(doc, {
      head: [['التاريخ', 'اسم العميل', 'الشقة', 'النوع', 'المبلغ', 'الوصف', 'ملاحظات']],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        halign: 'right',
      },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        halign: 'right',
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 253, 244],
      },
      margin: { top: 20, right: 10, bottom: 20, left: 10 },
    });

    doc.save('سجل-التسليمات.pdf');
    toast({ title: 'تم تصدير الملف بنجاح' });
  };

  const clientOptions = [
    { id: 'all', name: 'جميع العملاء', apartmentNumber: '', propertyType: 'apartment' as const },
    ...clients,
  ];

  return (
    <div className="space-y-6">
      {/* Filters & Export */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600" />
            سجل التسليمات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Client Filter */}
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-gray-600">العميل</span>
              <Select
                value={filterClientId}
                onValueChange={setFilterClientId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="جميع العملاء" />
                </SelectTrigger>
                <SelectContent>
                  {clientOptions.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                      {client.apartmentNumber ? ` - ${client.apartmentNumber}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Month Filter */}
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-gray-600">الشهر</span>
              <Select
                value={filterMonth}
                onValueChange={setFilterMonth}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="جميع الأشهر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأشهر</SelectItem>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Filter */}
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-gray-600">السنة</span>
              <Select
                value={filterYear}
                onValueChange={setFilterYear}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="السنة" />
                </SelectTrigger>
                <SelectContent>
                  {getYearOptions().map((y) => (
                    <SelectItem key={y.value} value={y.value}>
                      {y.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <FileSpreadsheet className="h-4 w-4" />
              تصدير Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <FileText className="h-4 w-4" />
              تصدير PDF
            </Button>
            <div className="flex-1" />
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Download className="h-4 w-4" />
              <span>
                {deliveries.length} تسليم — الإجمالي:{' '}
                <span className="font-bold text-emerald-700">
                  {totalAmount.toLocaleString()} درهم
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
          ) : deliveries.length === 0 ? (
            <div className="text-center py-16">
              <Truck className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">لا يوجد تسليمات</p>
              <p className="text-gray-400 text-sm mt-1">
                لا توجد تسليمات مطابقة لمعايير البحث المحددة
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">اسم العميل</TableHead>
                      <TableHead className="text-right">الشقة</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleDeliveries.map((delivery, idx) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="text-right whitespace-nowrap">
                          {new Date(delivery.deliveryDate).toLocaleDateString('ar-MA')}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {delivery.clientName}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center gap-1">
                            {delivery.clientApartment}
                            {delivery.clientPropertyType && (
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded ${
                                  delivery.clientPropertyType === 'apartment'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}
                              >
                                {delivery.clientPropertyType === 'apartment' ? 'شقة' : 'محل'}
                              </span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-emerald-700 whitespace-nowrap">
                          {delivery.amount.toLocaleString()} درهم
                        </TableCell>
                        <TableCell className="text-right max-w-[200px] truncate">
                          {delivery.description}
                        </TableCell>
                        <TableCell className="text-right text-gray-500 max-w-[150px] truncate">
                          {delivery.notes || '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Total Row */}
                    <TableRow className="bg-emerald-50/50 font-bold">
                      <TableCell className="text-right" colSpan={3}>
                        الإجمالي
                      </TableCell>
                      <TableCell className="text-right text-emerald-700">
                        {totalAmount.toLocaleString()} درهم
                      </TableCell>
                      <TableCell colSpan={2} />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {visibleDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">
                        {delivery.clientName}
                      </span>
                      <span className="font-bold text-emerald-700">
                        {delivery.amount.toLocaleString()} درهم
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{new Date(delivery.deliveryDate).toLocaleDateString('ar-MA')}</span>
                      <span>•</span>
                      <span>{delivery.clientApartment}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          delivery.clientPropertyType === 'apartment'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {delivery.clientPropertyType === 'apartment' ? 'شقة' : 'محل'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{delivery.description}</p>
                    {delivery.notes && (
                      <p className="text-xs text-gray-400">{delivery.notes}</p>
                    )}
                  </div>
                ))}
                <div className="border rounded-lg p-3 bg-emerald-50/50 flex items-center justify-between font-bold">
                  <span>الإجمالي</span>
                  <span className="text-emerald-700">
                    {totalAmount.toLocaleString()} درهم
                  </span>
                </div>
              </div>

              {/* Show More */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    عرض المزيد ({deliveries.length - visibleCount} المتبقي)
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}