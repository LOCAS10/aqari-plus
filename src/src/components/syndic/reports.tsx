'use client';

import { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { FileSpreadsheet, FileText, Download, Calendar, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type {
  MonthlyReport,
  YearlyReport,
  AccountReport,
  LateReport,
  Payment,
  Client,
  MONTH_NAMES,
  FEE_AMOUNTS,
} from '@/lib/types';

const MONTH_OPTIONS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

export default function ReportsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('monthly');
  const [loading, setLoading] = useState(false);

  // ─── Monthly state ───
  const [month, setMonth] = useState<string>('1');
  const [monthlyYear, setMonthlyYear] = useState<string>(new Date().getFullYear().toString());
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);

  // ─── Yearly state ───
  const [yearlyYear, setYearlyYear] = useState<string>(new Date().getFullYear().toString());
  const [yearlyReport, setYearlyReport] = useState<YearlyReport | null>(null);

  // ─── Account state ───
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [accountReport, setAccountReport] = useState<AccountReport | null>(null);

  // ─── Late state ───
  const [lateReport, setLateReport] = useState<LateReport | null>(null);

  // ─── Fetch clients for account dropdown ───
  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/api/clients');
        if (res.ok) {
          const data = await res.json();
          setClients(data.clients ?? data);
        }
      } catch {
        // silent
      }
    }
    fetchClients();
  }, []);

  // ─── Fetch: Monthly ───
  const fetchMonthly = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?type=monthly&month=${month}&year=${monthlyYear}`);
      if (!res.ok) throw new Error('فشل في جلب التقرير');
      const data: MonthlyReport = await res.json();
      setMonthlyReport(data);
    } catch {
      toast({ title: 'خطأ', description: 'فشل في جلب التقرير الشهري', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [month, monthlyYear, toast]);

  // ─── Fetch: Yearly ───
  const fetchYearly = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?type=yearly&year=${yearlyYear}`);
      if (!res.ok) throw new Error('فشل في جلب التقرير');
      const data: YearlyReport = await res.json();
      setYearlyReport(data);
    } catch {
      toast({ title: 'خطأ', description: 'فشل في جلب التقرير السنوي', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [yearlyYear, toast]);

  // ─── Fetch: Account ───
  const fetchAccount = useCallback(async () => {
    if (!selectedClientId) {
      toast({ title: 'تنبيه', description: 'يرجى اختيار عميل', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?type=account&clientId=${selectedClientId}`);
      if (!res.ok) throw new Error('فشل في جلب التقرير');
      const data: AccountReport = await res.json();
      setAccountReport(data);
    } catch {
      toast({ title: 'خطأ', description: 'فشل في جلب تقرير الحساب', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [selectedClientId, toast]);

  // ─── Fetch: Late ───
  const fetchLate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports?type=late');
      if (!res.ok) throw new Error('فشل في جلب التقرير');
      const data: LateReport = await res.json();
      setLateReport(data);
    } catch {
      toast({ title: 'خطأ', description: 'فشل في جلب تقرير المتأخرين', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // ─── Excel & PDF helpers ───
  function exportToExcel(data: Record<string, unknown>[], filename: string) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename);
  }

  function exportToPDF(headers: string[], rows: unknown[][], filename: string, title?: string) {
    const doc = new jsPDF({ orientation: 'landscape' });
    if (title) {
      doc.setFontSize(16);
      doc.text(title, 14, 20);
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 28,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [5, 150, 105] },
      });
    } else {
      autoTable(doc, {
        head: [headers],
        body: rows,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [5, 150, 105] },
      });
    }
    doc.save(filename);
  }

  // ─── Export: Monthly ───
  function exportMonthlyExcel() {
    if (!monthlyReport) return;
    const data = monthlyReport.payments.map((p: Payment) => ({
      'اسم العميل': p.clientName,
      'الشقة': p.apartmentNumber,
      'المبلغ': p.amount,
      'رقم العملية': p.transactionNumber ?? '',
      'تاريخ الدفع': p.paymentDate,
    }));
    exportToExcel(data, `تقرير_شهري_${monthlyYear}_${month}.xlsx`);
  }

  function exportMonthlyPDF() {
    if (!monthlyReport) return;
    const headers = ['اسم العميل', 'الشقة', 'المبلغ', 'رقم العملية', 'تاريخ الدفع'];
    const rows = monthlyReport.payments.map((p: Payment) => [
      p.clientName, p.apartmentNumber, p.amount, p.transactionNumber ?? '', p.paymentDate,
    ]);
    rows.push(['', '', `الإجمالي: ${monthlyReport.total}`, '', '']);
    exportToPDF(headers, rows, `تقرير_شهري_${monthlyYear}_${month}.pdf`, `تقرير شهري - ${monthlyReport.monthName} ${monthlyYear}`);
  }

  // ─── Export: Yearly ───
  function exportYearlyExcel() {
    if (!yearlyReport) return;
    const data = yearlyReport.monthlyBreakdown.map((m) => ({
      'الشهر': m.monthName,
      'عدد المدفوعات': m.count,
      'المبلغ': m.total,
    }));
    data.push({ 'الشهر': 'الإجمالي', 'عدد المدفوعات': yearlyReport.paymentCount, 'المبلغ': yearlyReport.total });
    exportToExcel(data, `تقرير_سنوي_${yearlyYear}.xlsx`);
  }

  function exportYearlyPDF() {
    if (!yearlyReport) return;
    const headers = ['الشهر', 'عدد المدفوعات', 'المبلغ'];
    const rows = yearlyReport.monthlyBreakdown.map((m) => [m.monthName, m.count, m.total]);
    rows.push(['الإجمالي', yearlyReport.paymentCount, yearlyReport.total]);
    exportToPDF(headers, rows, `تقرير_سنوي_${yearlyYear}.pdf`, `تقرير سنوي - ${yearlyYear}`);
  }

  // ─── Export: Account ───
  function exportAccountExcel() {
    if (!accountReport) return;
    const data = accountReport.payments.map((p: Payment) => ({
      'الشهر': p.month,
      'السنة': p.year,
      'المبلغ': p.amount,
      'رقم العملية': p.transactionNumber ?? '',
    }));
    exportToExcel(data, `تقرير_حساب_${accountReport.client.name}.xlsx`);
  }

  function exportAccountPDF() {
    if (!accountReport) return;
    const headers = ['الشهر', 'السنة', 'المبلغ', 'رقم العملية'];
    const rows = accountReport.payments.map((p: Payment) => [
      p.month, p.year, p.amount, p.transactionNumber ?? '',
    ]);
    rows.push(['', `الإجمالي المدفوع: ${accountReport.totalPaid}`, '', '']);
    exportToPDF(headers, rows, `تقرير_حساب_${accountReport.client.name}.pdf`, `تقرير حساب - ${accountReport.client.name}`);
  }

  // ─── Export: Late ───
  function exportLateExcel() {
    if (!lateReport) return;
    const data = lateReport.lateClients.map((entry) => ({
      'اسم العميل': entry.client.name,
      'الشقة': entry.client.apartmentNumber,
      'النوع': entry.client.propertyType,
      'الأشهر غير المدفوعة': entry.monthsUnpaid.join(', '),
      'المبلغ المستحق': entry.monthsUnpaid.length * (entry.client.fee ?? 0),
    }));
    data.push({ 'اسم العميل': '', 'الشقة': '', 'النوع': '', 'الأشهر غير المدفوعة': 'الإجمالي', 'المبلغ المستحق': lateReport.totalUnpaid });
    exportToExcel(data, 'تقرير_المتأخرين.xlsx');
  }

  function exportLatePDF() {
    if (!lateReport) return;
    const headers = ['اسم العميل', 'الشقة', 'النوع', 'الأشهر غير المدفوعة', 'المبلغ المستحق'];
    const rows = lateReport.lateClients.map((entry) => [
      entry.client.name,
      entry.client.apartmentNumber,
      entry.client.propertyType,
      entry.monthsUnpaid.join(', '),
      entry.monthsUnpaid.length * (entry.client.fee ?? 0),
    ]);
    rows.push(['', '', '', 'الإجمالي', lateReport.totalUnpaid]);
    exportToPDF(headers, rows, 'تقرير_المتأخرين.pdf', 'تقرير المتأخرين');
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">التقارير</h1>
      </div>

      <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 gap-1">
          <TabsTrigger value="monthly" className="text-sm">
            <Calendar className="ml-1 h-4 w-4 inline" />
            تقرير شهري
          </TabsTrigger>
          <TabsTrigger value="yearly" className="text-sm">
            <Calendar className="ml-1 h-4 w-4 inline" />
            تقرير سنوي
          </TabsTrigger>
          <TabsTrigger value="account" className="text-sm">
            <FileText className="ml-1 h-4 w-4 inline" />
            تقرير حساب
          </TabsTrigger>
          <TabsTrigger value="late" className="text-sm">
            <AlertTriangle className="ml-1 h-4 w-4 inline" />
            تقرير المتأخرين
          </TabsTrigger>
        </TabsList>

        {/* ════════════════════════════════════════════
            TAB 1 — Monthly Report
        ════════════════════════════════════════════ */}
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">فلاتر التقرير الشهري</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-1">
                  <Label>الشهر</Label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="اختر الشهر" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_OPTIONS.map((name, idx) => (
                        <SelectItem key={idx + 1} value={String(idx + 1)}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>السنة</Label>
                  <Input
                    type="number"
                    className="w-[120px]"
                    value={monthlyYear}
                    onChange={(e) => setMonthlyYear(e.target.value)}
                    min={2020}
                  />
                </div>
                <Button onClick={fetchMonthly} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'جارٍ التحميل...' : 'عرض التقرير'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {monthlyReport && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">
                    تقرير {monthlyReport.monthName} {monthlyReport.year}
                  </h2>
                  <Badge variant="secondary">{monthlyReport.paymentCount} عملية</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportMonthlyExcel}>
                    <FileSpreadsheet className="ml-1 h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportMonthlyPDF}>
                    <Download className="ml-1 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم العميل</TableHead>
                        <TableHead>الشقة</TableHead>
                        <TableHead>المبلغ</TableHead>
                        <TableHead>رقم العملية</TableHead>
                        <TableHead>تاريخ الدفع</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyReport.payments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                            لا توجد مدفوعات في هذا الشهر
                          </TableCell>
                        </TableRow>
                      ) : (
                        monthlyReport.payments.map((p: Payment, i: number) => (
                          <TableRow key={i}>
                            <TableCell>{p.clientName}</TableCell>
                            <TableCell>{p.apartmentNumber}</TableCell>
                            <TableCell>{p.amount}</TableCell>
                            <TableCell>{p.transactionNumber ?? '—'}</TableCell>
                            <TableCell>{p.paymentDate}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Badge className="bg-emerald-600 text-white text-base px-4 py-1.5">
                  الإجمالي: {monthlyReport.total}
                </Badge>
              </div>
            </>
          )}
        </TabsContent>

        {/* ════════════════════════════════════════════
            TAB 2 — Yearly Report
        ════════════════════════════════════════════ */}
        <TabsContent value="yearly" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">فلاتر التقرير السنوي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-1">
                  <Label>السنة</Label>
                  <Input
                    type="number"
                    className="w-[120px]"
                    value={yearlyYear}
                    onChange={(e) => setYearlyYear(e.target.value)}
                    min={2020}
                  />
                </div>
                <Button onClick={fetchYearly} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'جارٍ التحميل...' : 'عرض التقرير'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {yearlyReport && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">تقرير سنة {yearlyReport.year}</h2>
                  <Badge variant="secondary">{yearlyReport.paymentCount} عملية</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportYearlyExcel}>
                    <FileSpreadsheet className="ml-1 h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportYearlyPDF}>
                    <Download className="ml-1 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الشهر</TableHead>
                        <TableHead>عدد المدفوعات</TableHead>
                        <TableHead>المبلغ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyReport.monthlyBreakdown.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell>{m.monthName}</TableCell>
                          <TableCell>{m.count}</TableCell>
                          <TableCell>{m.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Badge className="bg-emerald-600 text-white text-base px-4 py-1.5">
                  الإجمالي: {yearlyReport.total}
                </Badge>
              </div>
            </>
          )}
        </TabsContent>

        {/* ════════════════════════════════════════════
            TAB 3 — Account Report
        ════════════════════════════════════════════ */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">فلاتر تقرير الحساب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-1">
                  <Label>العميل</Label>
                  <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="اختر عميلاً" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c: Client) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name} — شقة {c.apartmentNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={fetchAccount} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'جارٍ التحميل...' : 'عرض التقرير'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {accountReport && (
            <>
              {/* Client info card */}
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="pt-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">الاسم:</span>
                      <p className="font-semibold">{accountReport.client.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">الهاتف:</span>
                      <p className="font-semibold">{accountReport.client.phone ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">الشقة:</span>
                      <p className="font-semibold">{accountReport.client.apartmentNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">النوع:</span>
                      <p className="font-semibold">{accountReport.client.propertyType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">مدفوعات العميل</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportAccountExcel}>
                    <FileSpreadsheet className="ml-1 h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportAccountPDF}>
                    <Download className="ml-1 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الشهر</TableHead>
                        <TableHead>السنة</TableHead>
                        <TableHead>المبلغ</TableHead>
                        <TableHead>رقم العملية</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountReport.payments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-400 py-8">
                            لا توجد مدفوعات مسجلة
                          </TableCell>
                        </TableRow>
                      ) : (
                        accountReport.payments.map((p: Payment, i: number) => (
                          <TableRow key={i}>
                            <TableCell>{p.month}</TableCell>
                            <TableCell>{p.year}</TableCell>
                            <TableCell>{p.amount}</TableCell>
                            <TableCell>{p.transactionNumber ?? '—'}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Badge className="bg-emerald-600 text-white text-base px-4 py-1.5">
                  إجمالي المدفوعات: {accountReport.totalPaid}
                </Badge>
              </div>
            </>
          )}
        </TabsContent>

        {/* ════════════════════════════════════════════
            TAB 4 — Late Report
        ════════════════════════════════════════════ */}
        <TabsContent value="late" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold">تقرير المتأخرين عن الدفع</h2>
            </div>
            <Button onClick={fetchLate} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
              {loading ? 'جارٍ التحميل...' : 'عرض التقرير'}
            </Button>
          </div>

          {lateReport && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">
                    {lateReport.lateClients.length} متأخر
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportLateExcel}>
                    <FileSpreadsheet className="ml-1 h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportLatePDF}>
                    <Download className="ml-1 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم العميل</TableHead>
                        <TableHead>الشقة</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الأشهر غير المدفوعة</TableHead>
                        <TableHead>المبلغ المستحق</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lateReport.lateClients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                            لا يوجد متأخرون — جميع المستأجرين ملتزمون
                          </TableCell>
                        </TableRow>
                      ) : (
                        lateReport.lateClients.map((entry, i) => (
                          <TableRow key={i}>
                            <TableCell>{entry.client.name}</TableCell>
                            <TableCell>{entry.client.apartmentNumber}</TableCell>
                            <TableCell>{entry.client.propertyType}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {entry.monthsUnpaid.map((m) => (
                                  <Badge key={m} variant="outline" className="text-red-600 border-red-300 text-xs">
                                    {MONTH_OPTIONS[(m as number) - 1] ?? m}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-red-600">
                              {entry.monthsUnpaid.length * (entry.client.fee ?? 0)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Badge className="bg-red-600 text-white text-base px-4 py-1.5">
                  إجمالي المستحق: {lateReport.totalUnpaid}
                </Badge>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}