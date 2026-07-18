'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User, Phone, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  name: string;
  phone: string | null;
  apartmentNumber: string;
  propertyType: string;
  latestPayment: string | null;
  latestPaymentAmount: number | null;
}

export default function SearchPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error('فشل في البحث');
      const data: SearchResult[] = await res.json();
      setResults(data);
      setSearched(true);
    } catch {
      toast({ title: 'خطأ', description: 'فشل في البحث، يرجى المحاولة مرة أخرى', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Debounced search (300ms after typing stops)
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length === 0) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performSearch]);

  function handleSearch() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    performSearch(query);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800">البحث</h1>

      {/* Search bar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="أدخل كلمة للبحث..."
            className="pr-10 text-right"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 shrink-0"
        >
          <Search className="ml-1 h-4 w-4" />
          {loading ? 'جارٍ البحث...' : 'بحث'}
        </Button>
      </div>

      {/* Results */}
      {!searched && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Search className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg">أدخل كلمة للبحث</p>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Search className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg">لا توجد نتائج</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        </div>
      )}

      {results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <Card
              key={result.id}
              className="border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <CardContent className="pt-5 space-y-3">
                {/* Client name */}
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-gray-800 truncate">
                    {result.name}
                  </span>
                </div>

                {/* Phone */}
                {result.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    <span dir="ltr">{result.phone}</span>
                  </div>
                )}

                {/* Apartment + Type */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Home className="h-4 w-4 text-gray-400 shrink-0" />
                    <span>شقة {result.apartmentNumber}</span>
                  </div>
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">
                    {result.propertyType}
                  </Badge>
                </div>

                {/* Latest payment */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-sm">
                  <span className="text-gray-500">آخر دفع:</span>
                  {result.latestPayment ? (
                    <Badge className="bg-emerald-100 text-emerald-800 text-xs hover:bg-emerald-100">
                      {result.latestPayment}
                      {result.latestPaymentAmount != null && (
                        <span className="mr-1">— {result.latestPaymentAmount}</span>
                      )}
                    </Badge>
                  ) : (
                    <span className="text-gray-400 text-xs">لا توجد مدفوعات</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}