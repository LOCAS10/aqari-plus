import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import type { SearchResult, Client, Payment } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query parameter "q" is required and must be non-empty' },
        { status: 400 }
      );
    }

    if (!isFirebaseConfigured()) {
      return NextResponse.json([], { status: 200 });
    }

    // Fetch all clients and payments
    const [clientsSnap, paymentsSnap] = await Promise.all([
      getDocs(collection(db, 'clients')),
      getDocs(collection(db, 'payments')),
    ]);

    const clients = clientsSnap.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Client)
    );
    const payments = paymentsSnap.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Payment)
    );

    const queryLower = q.toLowerCase().trim();

    // Filter clients whose name, phone, or apartmentNumber matches (case-insensitive)
    const matchedClients = clients.filter((c) => {
      const name = (c.name || '').toLowerCase();
      const phone = (c.phone || '').toLowerCase();
      const apartment = (c.apartmentNumber || '').toLowerCase();
      return (
        name.includes(queryLower) ||
        phone.includes(queryLower) ||
        apartment.includes(queryLower)
      );
    });

    // Build results with latest payment info
    const results: SearchResult[] = matchedClients.map((client) => {
      const clientPayments = payments.filter((p) => p.clientId === client.id);

      // Find the latest payment (most recent month/year combination)
      let latestPayment: string | null = null;
      let latestPaymentAmount: number | null = null;

      if (clientPayments.length > 0) {
        // Sort by year desc, then month desc to find the most recent
        const sorted = [...clientPayments].sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          return b.month - a.month;
        });

        const latest = sorted[0];
        const monthStr = String(latest.month).padStart(2, '0');
        latestPayment = `${latest.year}-${monthStr}`;
        latestPaymentAmount = latest.amount || null;
      }

      return {
        id: client.id,
        name: client.name,
        phone: client.phone,
        apartmentNumber: client.apartmentNumber,
        propertyType: client.propertyType,
        latestPayment,
        latestPaymentAmount,
      };
    });

    // Sort alphabetically by name
    results.sort((a, b) => a.name.localeCompare(b.name, 'ar'));

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}