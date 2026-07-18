'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { Plus, Trash2, Banknote, Filter } from 'lucide-react';
import type { Payment, Client } from '@/lib/types';
import { MONTH_NAMES, FEE_AMOUNTS } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const now = new Date();
const defaultMonth = now.getMonth() + 1;
const defaultYear = now.getFullYear();

const initialForm = {
  clientId: '',
  month: '',
  year: defaultYear.toString(),
  paymentDate: '',
  notes: '',
};

export default function PaymentManager() {
  const { toast } = useToast();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterMonth, setFilterMonth] = useState(defaultMonth.toString());
  const [filterYear, setFilterYear] = useState(defaultYear.toString());

  // Add dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Derived: selected client for auto-amount
  const selectedClient = clients.find((c) => c.id === form.clientId);
  const autoAmount = selectedClient
    ? FEE_AMOUNTS[selectedClient.propertyType]
    : 0;

  // ---- Fetch helpers ----
  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch {
      toast({ title: 'خطأ', description: 'فشل في تحميل العملاء', variant: 'destructive' });
    }
  }, [toast]);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        month: filterMonth,
        year: filterYear,
      });
      const res = await fetch(`/api/payments?${params.toString()}`);
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch {
      toast({ title: 'خطأ', description: 'فشل في تحميل المدفوعات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [filterMonth, filterYear, toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // ---- Form handlers ----
  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetAndClose = () => {
    setForm(initialForm);
    setSubmitting(false);
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (!form.clientId || !form.month || !form.year || !form.paymentDate) {
      toast({ title: 'خطأ', description: 'يرجى ملء جميع الحقول المطلوبة', variant: 'destructive' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: form.clientId,
          month: parseInt(form.month, 10),
          year: parseInt(form.year, 10),
          paymentDate: form.paymentDate,
          paymentMethod: 'cash' as const,
          notes: form.notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: 'خطأ', description: data.error || 'فشل في إضافة الدفعة', variant: 'destructive' });
        return;
      }

      toast({ title: 'تم بنجاح', description: 'تمت إضافة الدفعة بنجاح' });
      resetAndClose();
      fetchPayments();
    } catch {
      toast({ title: 'خطأ', description: 'فشل في إضافة الدفعة', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Delete handler ----
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/payments/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        toast({ title: 'خطأ', description: 'فشل في حذف الدفعة', variant: 'destructive' });
        return;
      }

      toast({ title: 'تم بنجاح', description: 'تم حذف الدفعة بنجاح' });
      setDeleteTarget(null);
      fetchPayments();
    } catch {
      toast({ title: 'خطأ', description: 'فشل في حذف الدفعة', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  // ---- Format helpers ----
  const formatAmount = (amount: number) =>
    `${amount.toLocaleString('ar-DZ')} درهم`;

  // ---- Years for selects ----
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Banknote className="h-6 w-6 text-emerald-600" />
          إدارة المدفوعات
        </h2>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة دفعة
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex items-center gap-2 text-emerald-700 font-medium shrink-0">
              <Filter className="h-4 w-4" />
              <span>تصفية:</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Month filter */}
              <div className="flex flex-col gap-1.5 min-w-[160px]">
                <Label className="text-sm text-gray-600">الشهر</Label>
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الشهر" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_NAMES.map((name, idx) => (
                      <SelectItem key={idx} value={(idx + 1).toString()}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year filter */}
              <div className="flex flex-col gap-1.5 min-w-[140px]">
                <Label className="text-sm text-gray-600">السنة</Label>
                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر السنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
              <Banknote className="h-12 w-12" />
              <p className="text-lg">لا يوجد مدفوعات</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-emerald-50/70 hover:bg-emerald-50/70">
                    <TableHead className="text-gray-700 font-semibold">رقم العملية</TableHead>
                    <TableHead className="text-gray-700 font-semibold">اسم العميل</TableHead>
                    <TableHead className="text-gray-700 font-semibold">الشقة</TableHead>
                    <TableHead className="text-gray-700 font-semibold">المبلغ</TableHead>
                    <TableHead className="text-gray-700 font-semibold">الشهر</TableHead>
                    <TableHead className="text-gray-700 font-semibold">السنة</TableHead>
                    <TableHead className="text-gray-700 font-semibold">تاريخ الدفع</TableHead>
                    <TableHead className="text-gray-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow
                      key={payment.id}
                      className="hover:bg-emerald-50/30 transition-colors"
                    >
                      <TableCell className="font-mono text-sm text-gray-600">
                        {payment.operationNumber}
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">
                        {payment.clientName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            payment.clientPropertyType === 'apartment'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }
                        >
                          {payment.clientApartment}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-700">
                        {formatAmount(payment.amount)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {MONTH_NAMES[payment.month - 1]}
                      </TableCell>
                      <TableCell className="text-gray-600">{payment.year}</TableCell>
                      <TableCell className="text-gray-600">
                        {payment.paymentDate}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTarget(payment)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Payment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && resetAndClose()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-700">
              <Plus className="h-5 w-5" />
              إضافة دفعة جديدة
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Client select */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="client" className="text-gray-700">
                العميل <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.clientId}
                onValueChange={(val) => updateField('clientId', val)}
              >
                <SelectTrigger id="client">
                  <SelectValue placeholder="اختر العميل" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} — {client.apartmentNumber} (
                      {client.propertyType === 'apartment' ? 'شقة' : 'محل'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto-calculated amount (read-only) */}
            {selectedClient && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-gray-700">المبلغ</Label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-lg">
                  {formatAmount(autoAmount)}
                  <span className="text-xs font-normal text-emerald-600 mr-auto">
                    ({selectedClient.propertyType === 'apartment' ? 'شقة' : 'محل'} — تلقائي)
                  </span>
                </div>
              </div>
            )}

            {/* Month select */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="month" className="text-gray-700">
                الشهر <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.month}
                onValueChange={(val) => updateField('month', val)}
              >
                <SelectTrigger id="month">
                  <SelectValue placeholder="اختر الشهر" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_NAMES.map((name, idx) => (
                    <SelectItem key={idx} value={(idx + 1).toString()}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year input */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="year" className="text-gray-700">
                السنة <span className="text-red-500">*</span>
              </Label>
              <Input
                id="year"
                type="number"
                min={2000}
                max={2100}
                value={form.year}
                onChange={(e) => updateField('year', e.target.value)}
                placeholder="السنة"
              />
            </div>

            {/* Payment date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="paymentDate" className="text-gray-700">
                تاريخ الدفع <span className="text-red-500">*</span>
              </Label>
              <Input
                id="paymentDate"
                type="date"
                value={form.paymentDate}
                onChange={(e) => updateField('paymentDate', e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes" className="text-gray-700">
                ملاحظات
              </Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="ملاحظات إضافية (اختياري)"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={resetAndClose}
              disabled={submitting}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                  جارٍ الإضافة...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة الدفعة
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الدفعة الخاصة بـ{' '}
              <span className="font-semibold text-gray-800">
                {deleteTarget?.clientName}
              </span>{' '}
              لشهر{' '}
              <span className="font-semibold text-gray-800">
                {deleteTarget ? MONTH_NAMES[deleteTarget.month - 1] : ''}
              </span>{' '}
              ({deleteTarget ? formatAmount(deleteTarget.amount) : ''})؟
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel disabled={deleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                  جارٍ الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}