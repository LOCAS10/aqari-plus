'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Trash2, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Delivery, Client } from '@/lib/types';

const EMPTY_FORM = {
  clientId: '',
  amount: '',
  deliveryDate: new Date().toISOString().split('T')[0],
  description: '',
  notes: '',
};

export default function DeliveryManager() {
  const { toast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [clients, setClients] = useState<Client[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (Array.isArray(data)) {
        setClients(data);
      }
    } catch {
      // silently fail for client list
    }
  }, []);

  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/deliveries');
      const data = await res.json();
      if (Array.isArray(data)) {
        setDeliveries(data.slice(0, 10));
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
    fetchDeliveries();
  }, [fetchClients, fetchDeliveries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.clientId) {
      toast({ title: 'يرجى اختيار العميل', variant: 'destructive' });
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      toast({ title: 'يرجى إدخال مبلغ صحيح أكبر من صفر', variant: 'destructive' });
      return;
    }
    if (!form.deliveryDate) {
      toast({ title: 'يرجى تحديد تاريخ التسليم', variant: 'destructive' });
      return;
    }
    if (!form.description.trim()) {
      toast({ title: 'يرجى إدخال الوصف', variant: 'destructive' });
      return;
    }

    try {
      setSubmitting(true);
      const body: Record<string, unknown> = {
        clientId: form.clientId,
        amount: Number(form.amount),
        deliveryDate: form.deliveryDate,
        description: form.description.trim(),
      };
      if (form.notes.trim()) {
        body.notes = form.notes.trim();
      }

      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        toast({ title: err.error || 'فشل في إضافة التسليم', variant: 'destructive' });
        return;
      }

      toast({ title: 'تمت إضافة التسليم بنجاح' });
      setForm(EMPTY_FORM);
      fetchDeliveries();
    } catch {
      toast({ title: 'حدث خطأ أثناء إضافة التسليم', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('هل أنت متأكد من حذف هذا التسليم؟');
    if (!confirmed) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/deliveries/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: err.error || 'فشل في حذف التسليم', variant: 'destructive' });
        return;
      }
      toast({ title: 'تم حذف التسليم بنجاح' });
      fetchDeliveries();
    } catch {
      toast({ title: 'حدث خطأ أثناء حذف التسليم', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : '—';
  };

  return (
    <div className="space-y-6">
      {/* Create Delivery Form */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600" />
            إضافة تسليم جديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Client Select */}
              <div className="space-y-2">
                <Label htmlFor="clientId">العميل *</Label>
                <Select
                  value={form.clientId}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, clientId: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.apartmentNumber}
                        {' '}
                        <span className="text-muted-foreground text-xs">
                          ({client.propertyType === 'apartment' ? 'شقة' : 'محل'})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="أدخل المبلغ"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full"
                />
              </div>

              {/* Delivery Date */}
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">تاريخ التسليم *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={form.deliveryDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, deliveryDate: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">الوصف *</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="وصف التسليم"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  placeholder="ملاحظات إضافية (اختياري)"
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full min-h-[38px]"
                  rows={1}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <Plus className="h-4 w-4" />
                {submitting ? 'جارٍ الإضافة...' : 'إضافة تسليم'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600" />
            التسليمات الأخيرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
          ) : deliveries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا يوجد تسليمات حتى الآن</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">تاريخ التسليم</TableHead>
                    <TableHead className="text-right">الوصف</TableHead>
                    <TableHead className="text-right">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium text-right">
                        {delivery.clientName || getClientName(delivery.clientId)}
                      </TableCell>
                      <TableCell className="text-right">
                        {delivery.amount.toLocaleString()} درهم
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date(delivery.deliveryDate).toLocaleDateString('ar-MA')}
                      </TableCell>
                      <TableCell className="text-right max-w-[200px] truncate">
                        {delivery.description}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(delivery.id)}
                          disabled={deletingId === delivery.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === delivery.id ? 'جارٍ الحذف...' : 'حذف'}
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
    </div>
  );
}