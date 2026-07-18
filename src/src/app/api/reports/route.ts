import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import {
  MONTH_NAMES,
  FEE_AMOUNTS,
} from '@/lib/types';
import type {
  MonthlyReport,
  YearlyReport,
  AccountReport,
  LateReport,
  Payment,
  Client,
} from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase is not configured' },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as string;

    if (!type || !['monthly', 'yearly', 'account', 'late'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid or missing report type. Must be: monthly, yearly, account, or late' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'monthly':
        return handleMonthlyReport(searchParams);
      case 'yearly':
        return handleYearlyReport(searchParams);
      case 'account':
        return handleAccountReport(searchParams);
      case 'late':
        return handleLateReport(searchParams);
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function handleMonthlyReport(
  searchParams: URLSearchParams
): Promise<NextResponse> {
  const monthParam = searchParams.get('month');
  const yearParam = searchParams.get('year');

  if (!monthParam || !yearParam) {
    return NextResponse.json(
      { error: 'Month and year are required for monthly report' },
      { status: 400 }
    );
  }

  const month = parseInt(monthParam, 10);
  const year = parseInt(yearParam, 10);

  if (isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
    return NextResponse.json(
      { error: 'Invalid month or year value' },
      { status: 400 }
    );
  }

  const paymentsQuery = query(
    collection(db, 'payments'),
    where('month', '==', month),
    where('year', '==', year)
  );

  const paymentsSnap = await getDocs(paymentsQuery);
  const payments = paymentsSnap.docs.map(
    (d) => ({ id: d.id, ...d.data() } as Payment)
  );
  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const report: MonthlyReport = {
    month,
    year,
    monthName: MONTH_NAMES[month - 1],
    payments,
    total,
    paymentCount: payments.length,
  };

  return NextResponse.json(report, { status: 200 });
}

async function handleYearlyReport(
  searchParams: URLSearchParams
): Promise<NextResponse> {
  const yearParam = searchParams.get('year');

  if (!yearParam) {
    return NextResponse.json(
      { error: 'Year is required for yearly report' },
      { status: 400 }
    );
  }

  const year = parseInt(yearParam, 10);

  if (isNaN(year)) {
    return NextResponse.json(
      { error: 'Invalid year value' },
      { status: 400 }
    );
  }

  const paymentsQuery = query(
    collection(db, 'payments'),
    where('year', '==', year)
  );

  const paymentsSnap = await getDocs(paymentsQuery);
  const payments = paymentsSnap.docs.map(
    (d) => ({ id: d.id, ...d.data() } as Payment)
  );
  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Monthly breakdown
  const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthPayments = payments.filter((p) => p.month === month);
    return {
      month,
      monthName: MONTH_NAMES[i],
      total: monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      count: monthPayments.length,
    };
  });

  const report: YearlyReport = {
    year,
    payments,
    total,
    paymentCount: payments.length,
    monthlyBreakdown,
  };

  return NextResponse.json(report, { status: 200 });
}

async function handleAccountReport(
  searchParams: URLSearchParams
): Promise<NextResponse> {
  const clientId = searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json(
      { error: 'clientId is required for account report' },
      { status: 400 }
    );
  }

  // Fetch client
  const clientDoc = await getDoc(doc(db, 'clients', clientId));

  if (!clientDoc.exists()) {
    return NextResponse.json(
      { error: 'Client not found' },
      { status: 404 }
    );
  }

  const client = { id: clientDoc.id, ...clientDoc.data() } as Client;

  // Fetch all payments for this client
  const paymentsQuery = query(
    collection(db, 'payments'),
    where('clientId', '==', clientId)
  );

  const paymentsSnap = await getDocs(paymentsQuery);
  let payments = paymentsSnap.docs.map(
    (d) => ({ id: d.id, ...d.data() } as Payment)
  );

  // Sort by year desc, month desc
  payments.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });

  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const report: AccountReport = {
    client,
    payments,
    totalPaid,
  };

  return NextResponse.json(report, { status: 200 });
}

async function handleLateReport(
  searchParams: URLSearchParams
): Promise<NextResponse> {
  const monthParam = searchParams.get('month');
  const yearParam = searchParams.get('year');

  const now = new Date();
  const currentMonth = monthParam ? parseInt(monthParam, 10) : now.getMonth() + 1;
  const currentYear = yearParam ? parseInt(yearParam, 10) : now.getFullYear();

  if (
    isNaN(currentMonth) ||
    currentMonth < 1 ||
    currentMonth > 12 ||
    isNaN(currentYear)
  ) {
    return NextResponse.json(
      { error: 'Invalid month or year value' },
      { status: 400 }
    );
  }

  // Fetch all clients and all payments for the current year
  const [clientsSnap, paymentsSnap] = await Promise.all([
    getDocs(collection(db, 'clients')),
    getDocs(query(collection(db, 'payments'), where('year', '==', currentYear))),
  ]);

  const clients = clientsSnap.docs.map(
    (d) => ({ id: d.id, ...d.data() } as Client)
  );
  const payments = paymentsSnap.docs.map(
    (d) => ({ id: d.id, ...d.data() } as Payment)
  );

  // Find clients with no payment for the current month
  const paidForCurrentMonth = new Set(
    payments.filter((p) => p.month === currentMonth).map((p) => p.clientId)
  );

  const lateClientList = clients.filter(
    (c) => !paidForCurrentMonth.has(c.id)
  );

  // For each late client, find all unpaid months in the current year
  const lateClients = lateClientList.map((client) => {
    const clientPayments = payments.filter((p) => p.clientId === client.id);
    const paidMonths = new Set(clientPayments.map((p) => p.month));

    // All months from 1 to currentMonth that haven't been paid
    const monthsUnpaid: number[] = [];
    for (let m = 1; m <= currentMonth; m++) {
      if (!paidMonths.has(m)) {
        monthsUnpaid.push(m);
      }
    }

    return { client, monthsUnpaid };
  });

  // Calculate total unpaid
  const totalUnpaid = lateClients.reduce((sum, entry) => {
    const fee =
      FEE_AMOUNTS[entry.client.propertyType as keyof typeof FEE_AMOUNTS] || 0;
    return sum + entry.monthsUnpaid.length * fee;
  }, 0);

  const report: LateReport = {
    lateClients: lateClients.map((entry) => ({
      client: entry.client,
      monthsUnpaid: entry.monthsUnpaid,
    })),
    totalUnpaid,
  };

  return NextResponse.json(report, { status: 200 });
}