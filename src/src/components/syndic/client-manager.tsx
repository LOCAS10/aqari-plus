'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, Users, Building, Store, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Client } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  AlertDialogTrigger,
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

// ---------- Form state type ----------
type ClientFormData = {
  name: string;
  phone: string;
  apartmentNumber: string;
  propertyType: 'apartment' | 'shop';
  floor: string;
  notes: string;
};

const emptyForm: ClientFormData = {
  name: '',
  phone: '',
  apartmentNumber: '',
  propertyType: 'apartment',
  floor: '',
  notes: '',
};

// ---------- Component ----------
export default function ClientManager() {
  const { toast } = useToast();

  // Data state
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---------- Fetch clients ----------
  const fetchClients = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const url = search
        ? `/api/clients?search=${encodeURIComponent(search)}`
        : '/api/clients';
      const res = await fetch(url);
      if (!res.ok) throw new Error('فشل في جلب البيانات');
      const data: Client[] = await res.json();
      setClients(data);
    } catch {
      toast({ title: 'خطأ', description: 'فشل في جلب قائمة العملاء' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // ---------- Search with debounce ----------
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchClients(searchQuery);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery, fetchClients]);

  // ---------- Form helpers ----------
  const openAddDialog = () => {
    setEditingClient(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      apartmentNumber: client.apartmentNumber,
      propertyType: client.propertyType,
      floor: client.floor ?? '',
      notes: client.notes ?? '',
    });
    setDialogOpen(true);
  };

  const handleFormChange = (field: keyof ClientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ---------- Submit (Add / Edit) ----------
  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.apartmentNumber.trim()) return;

    setSubmitting(true);
    try {
      const body: Record<string, string> = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        apartmentNumber: formData.apartmentNumber.trim(),
        propertyType: formData.propertyType,
      };
      if (formData.floor.trim()) body.floor = formData.floor.trim();
      if (formData.notes.trim()) body.notes = formData.notes.trim();

      let res: Response;
      if (editingClient) {
        res = await fetch(`/api/clients/${editingClient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) throw new Error('فشل في العملية');

      toast({
        title: 'نجاح',
        description: editingClient
          ? 'تم تعديل بيانات العميل بنجاح'
          : 'تم إضافة العميل بنجاح',
      });

      setDialogOpen(false);
      fetchClients(searchQuery);
    } catch {
      toast({
        title: 'خطأ',
        description: editingClient
          ? 'فشل في تعديل بيانات العميل'
          : 'فشل في إضافة العميل',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/clients/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('فشل في الحذف');

      toast({
        title: 'نجاح',
        description: 'تم حذف العميل بنجاح',
      });

      setDeleteTarget(null);
      fetchClients(searchQuery);
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في حذف العميل',
      });
    } finally {
      setDeleting(false);
    }
  };

  // ---------- Render ----------
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Users className="h-6 w-6 text-emerald-600" />
            إدارة العملاء
          </CardTitle>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث عن عميل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 w-full sm:w-64"
              />
            </div>

            {/* Add button */}
            <Button
              onClick={openAddDialog}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة عميل
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Loading state */}
        {loading && clients.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : clients.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
            <Users className="h-12 w-12" />
            <p className="text-lg font-medium">لا يوجد عملاء</p>
            <p className="text-sm">اضغط على &quot;إضافة عميل&quot; لإضافة عميل جديد</p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50 hover:bg-emerald-50">
                  <TableHead className="font-bold">الاسم</TableHead>
                  <TableHead className="font-bold">الهاتف</TableHead>
                  <TableHead className="font-bold">رقم الشقة</TableHead>
                  <TableHead className="font-bold">النوع</TableHead>
                  <TableHead className="font-bold">الطابق</TableHead>
                  <TableHead className="font-bold text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell dir="ltr" className="text-right">
                      {client.phone || '—'}
                    </TableCell>
                    <TableCell>{client.apartmentNumber}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          client.propertyType === 'apartment'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                            : 'border-amber-300 bg-amber-50 text-amber-700'
                        }
                      >
                        {client.propertyType === 'apartment' ? (
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            شقة
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Store className="h-3 w-3" />
                            محل
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.floor || '—'}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(client)}
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          title="تعديل"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <AlertDialog open={deleteTarget?.id === client.id} onOpenChange={(open) => {
                          if (!open) setDeleteTarget(null);
                        }}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteTarget(client)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                              <AlertDialogDescription>
                                هل أنت متأكد من حذف العميل &quot;{client.name}&quot؛؟ لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={deleting}>
                                إلغاء
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDelete}
                                disabled={deleting}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                {deleting && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* ---------- Add / Edit Dialog ---------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingClient ? (
                <>
                  <Pencil className="h-5 w-5 text-emerald-600" />
                  تعديل بيانات العميل
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-emerald-600" />
                  إضافة عميل جديد
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="client-name">
                اسم العميل <span className="text-red-500">*</span>
              </Label>
              <Input
                id="client-name"
                placeholder="أدخل اسم العميل"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="client-phone">رقم الهاتف</Label>
              <Input
                id="client-phone"
                placeholder="أدخل رقم الهاتف"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                dir="ltr"
              />
            </div>

            {/* Property Type + Apartment Number row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Property Type */}
              <div className="grid gap-2">
                <Label>
                  نوع العقار <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(val) =>
                    handleFormChange('propertyType', val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">
                      <span className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" />
                        شقة
                      </span>
                    </SelectItem>
                    <SelectItem value="shop">
                      <span className="flex items-center gap-1">
                        <Store className="h-3.5 w-3.5" />
                        محل
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Apartment Number */}
              <div className="grid gap-2">
                <Label htmlFor="client-apt">
                  رقم الشقة/المحل <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="client-apt"
                  placeholder={formData.propertyType === 'apartment' ? 'رقم الشقة' : 'رقم المحل'}
                  value={formData.apartmentNumber}
                  onChange={(e) => handleFormChange('apartmentNumber', e.target.value)}
                />
              </div>
            </div>

            {/* Floor */}
            <div className="grid gap-2">
              <Label htmlFor="client-floor">الطابق</Label>
              <Input
                id="client-floor"
                placeholder="أدخل رقم الطابق"
                value={formData.floor}
                onChange={(e) => handleFormChange('floor', e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="client-notes">ملاحظات</Label>
              <Input
                id="client-notes"
                placeholder="ملاحظات إضافية (اختياري)"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                submitting ||
                !formData.name.trim() ||
                !formData.apartmentNumber.trim()
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              {editingClient ? 'حفظ التعديلات' : 'إضافة العميل'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
