// Admin Panel TypeScript Types

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  totalRevenue: number;
  mrrGrowth: number;
  churnRate: number;
  ltv: number;
  arpu: number;
  mrrHistory: { month: string; value: number }[];
}

export interface SalesMetrics {
  totalOrders: number;
  newOrders: number;
  renewals: number;
  conversionRate: number;
  averageOrderValue: number;
  ordersGrowth: number;
  salesHistory: { date: string; orders: number; revenue: number }[];
  ordersByPlan: { plan: string; count: number; revenue: number }[];
}

export interface TrafficMetrics {
  pageViews: number;
  sessions: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: string;
  pageViewsGrowth: number;
  topPages: { path: string; views: number; avgTime: string }[];
  sources: { name: string; value: number; color: string }[];
  trafficHistory: { date: string; views: number; sessions: number }[];
}

export interface FunnelMetrics {
  visitors: number;
  signups: number;
  trials: number;
  paid: number;
  signupRate: number;
  trialRate: number;
  paidRate: number;
  overallConversion: number;
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  paidUsers: number;
  freeUsers: number;
  retentionRate: number;
  userGrowthRate: number;
  userGrowth: { date: string; total: number; active: number; new: number }[];
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: 'active' | 'inactive' | 'churned';
  createdAt: string;
  lastActiveAt: string;
  totalSessions: number;
  lifetimeValue: number;
  dayCompleted: number;
}

export interface OverviewMetrics {
  revenue: RevenueMetrics;
  sales: SalesMetrics;
  traffic: TrafficMetrics;
  funnel: FunnelMetrics;
  users: UserMetrics;
}

export type DateRange = '7d' | '30d' | '90d' | '1y';

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Stripe/Payments Types
export interface StripePayment {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  customerEmail: string;
  customerName: string;
  description: string;
  createdAt: string;
  paymentMethod: string;
}

export interface StripeSubscription {
  id: string;
  customerEmail: string;
  customerName: string;
  plan: string;
  amount: number;
  interval: 'month' | 'year';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  totalSpent: number;
  subscriptionStatus: 'active' | 'canceled' | 'none';
  createdAt: string;
  paymentCount: number;
}

export interface StripeInvoice {
  id: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  dueDate: string;
  createdAt: string;
}

export interface StripeDispute {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'warning_needs_response' | 'needs_response' | 'under_review' | 'won' | 'lost';
  createdAt: string;
  customerEmail: string;
}

export interface StripeMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalCustomers: number;
  successRate: number;
  refundRate: number;
  disputeRate: number;
  avgTransactionValue: number;
}
