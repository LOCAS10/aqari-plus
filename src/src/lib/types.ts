// ===== Client Types =====
export interface Client {
  id: string;
  name: string;
  phone: string;
  apartmentNumber: string;
  propertyType: 'apartment' | 'shop';
  floor?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientInput {
  name: string;
  phone: string;
  apartmentNumber: string;
  propertyType: 'apartment' | 'shop';
  floor?: string;
  notes?: string;
}

// ===== Payment Types =====
export interface Payment {
  id: string;
  operationNumber: string;
  clientId: string;
  clientName: string;
  clientApartment: string;
  clientPropertyType: 'apartment' | 'shop';
  amount: number;
  month: number;
  year: number;
  paymentDate: string;
  paymentMethod: 'cash';
  notes?: string;
  receiptImage?: string;
  createdAt: string;
}

export interface PaymentInput {
  clientId: string;
  month: number;
  year: number;
  paymentDate: string;
  paymentMethod?: 'cash';
  notes?: string;
  receiptImage?: string;
}

// ===== Delivery Types =====
export interface Delivery {
  id: string;
  clientId: string;
  clientName: string;
  clientApartment: string;
  clientPropertyType: 'apartment' | 'shop';
  amount: number;
  deliveryDate: string;
  description: string;
  notes?: string;
  receiptImage?: string;
  createdAt: string;
}

export interface DeliveryInput {
  clientId: string;
  amount: number;
  deliveryDate: string;
  description: string;
  notes?: string;
  receiptImage?: string;
}

// ===== Dashboard Types =====
export interface DashboardStats {
  totalCollected: number;
  totalDelivered: number;
  currentBalance: number;
  totalApartments: number;
  totalShops: number;
  totalClients: number;
  lateClients: LateClient[];
  monthlyData: MonthlyData[];
  yearlyData: YearlyData[];
}

export interface LateClient {
  id: string;
  name: string;
  apartmentNumber: string;
  propertyType: 'apartment' | 'shop';
}

export interface MonthlyData {
  month: number;
  monthName: string;
  collected: number;
  delivered: number;
}

export interface YearlyData {
  year: number;
  collected: number;
  delivered: number;
}

// ===== Report Types =====
export interface MonthlyReport {
  month: number;
  year: number;
  monthName: string;
  payments: Payment[];
  total: number;
  paymentCount: number;
}

export interface YearlyReport {
  year: number;
  payments: Payment[];
  total: number;
  paymentCount: number;
  monthlyBreakdown: { month: number; monthName: string; total: number; count: number }[];
}

export interface AccountReport {
  client: Client;
  payments: Payment[];
  totalPaid: number;
}

export interface LateReport {
  lateClients: { client: Client; monthsUnpaid: number[] }[];
  totalUnpaid: number;
}

// ===== Search Types =====
export interface SearchResult {
  id: string;
  name: string;
  phone: string;
  apartmentNumber: string;
  propertyType: 'apartment' | 'shop';
  latestPayment: string | null;
  latestPaymentAmount: number | null;
}

// ===== Common =====
export const FEE_AMOUNTS = {
  apartment: 1500,
  shop: 1200,
} as const;

export const MONTH_NAMES = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
] as const;