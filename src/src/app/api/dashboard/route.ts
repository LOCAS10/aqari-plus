import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import type {
  DashboardStats,
  MonthlyData,
  YearlyData,
  LateClient,
  Client,
  Payment,
  Delivery,
} from '@/lib/types';
import { MONTH_NAMES } from '@/lib/types';

export async function GET(_request: NextRequest) {
  try {
    if (!isFirebaseConfigured()) {
      const emptyStats: DashboardStats = {
        totalCollected: 0,
        totalDelivered: 0,
        currentBalance: 0,
        totalApartments: 0,
        totalShops: 0,
        totalClients: 0,
        lateClients: [],
        monthlyData: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          monthName: MONTH_NAMES[i],
          collected: 0,
          delivered: 0,
        })),
        yearlyData: [],
      };
      return NextResponse.json(emptyStats, { status: 200 });
    }

    // Fetch all clients, payments, and deliveries
    const [clientsSnap, paymentsSnap, deliveriesSnap] = await Promise.all([
      getDocs(collection(db, 'clients')),
      getDocs(collection(db, 'payments')),
      getDocs(collection(db, 'deliveries')),
    ]);

    const clients = clientsSnap.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Client)
    );
    const payments = paymentsSnap.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Payment)
    );
    const deliveries = deliveriesSnap.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Delivery)
    );

    // Basic stats
    const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalDelivered = deliveries.reduce((sum, d) => sum + (d.amount || 0), 0);
    const currentBalance = totalCollected - totalDelivered;
    const totalApartments = clients.filter((c) => c.propertyType === 'apartment').length;
    const totalShops = clients.filter((c) => c.propertyType === 'shop').length;
    const totalClients = clients.length;

    // Late clients: clients with no payment for current month/year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const paidClientIds = new Set(
      payments
        .filter((p) => p.month === currentMonth && p.year === currentYear)
        .map((p) => p.clientId)
    );

    const lateClients: LateClient[] = clients
      .filter((c) => !paidClientIds.has(c.id))
      .map((c) => ({
        id: c.id,
        name: c.name,
        apartmentNumber: c.apartmentNumber,
        propertyType: c.propertyType,
      }));

    // Monthly data for current year (all 12 months)
    const monthlyData: MonthlyData[] = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthPayments = payments.filter(
        (p) => p.year === currentYear && p.month === month
      );
      const monthDeliveries = deliveries.filter((d) => {
        const date = new Date(d.deliveryDate);
        return (
          date.getFullYear() === currentYear &&
          date.getMonth() + 1 === month
        );
      });
      return {
        month,
        monthName: MONTH_NAMES[i],
        collected: monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
        delivered: monthDeliveries.reduce((sum, d) => sum + (d.amount || 0), 0),
      };
    });

    // Yearly data (last 5 years)
    const startYear = currentYear - 4;
    const yearlyData: YearlyData[] = Array.from({ length: 5 }, (_, i) => {
      const year = startYear + i;
      const yearPayments = payments.filter((p) => p.year === year);
      const yearDeliveries = deliveries.filter(
        (d) => new Date(d.deliveryDate).getFullYear() === year
      );
      return {
        year,
        collected: yearPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
        delivered: yearDeliveries.reduce((sum, d) => sum + (d.amount || 0), 0),
      };
    });

    const stats: DashboardStats = {
      totalCollected,
      totalDelivered,
      currentBalance,
      totalApartments,
      totalShops,
      totalClients,
      lateClients,
      monthlyData,
      yearlyData,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}