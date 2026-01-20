"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useEffect, useCallback } from "react";

// Simple auth key
const AUTH_KEY = "t21_admin_auth";

/**
 * Simple admin authentication hook
 */
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loginAction = useAction(api.adminAuth.login);

  // Check auth on mount
  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(auth === "true");
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const result = await loginAction({ username, password });
      if (result.success) {
        localStorage.setItem(AUTH_KEY, "true");
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: result.error };
    },
    [loginAction]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}

/**
 * Hook for dashboard metrics
 */
export function useDashboardMetrics() {
  const metrics = useQuery(api.admin.getMetrics, {});
  return {
    metrics,
    isLoading: metrics === undefined,
  };
}

/**
 * Hook for revenue data with period selection
 */
export function useRevenue(period: "7d" | "30d" | "90d") {
  const revenue = useQuery(api.admin.getRevenue, { period });
  return {
    revenue,
    isLoading: revenue === undefined,
  };
}

/**
 * Hook for sales by product
 */
export function useSalesByProduct() {
  const sales = useQuery(api.admin.getSalesByProduct, {});
  return {
    sales,
    isLoading: sales === undefined,
  };
}

/**
 * Hook for recent purchases (real-time updates)
 */
export function useRecentPurchases(limit?: number) {
  const purchases = useQuery(api.purchases.getRecent, { limit });
  return {
    purchases: purchases ?? [],
    isLoading: purchases === undefined,
  };
}

/**
 * Hook for customers list with pagination and search
 */
export function useCustomers(options?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const result = useQuery(api.customers.list, {
    page: options?.page ?? 1,
    limit: options?.limit ?? 20,
    search: options?.search,
  });

  return {
    customers: result?.customers ?? [],
    pagination: result?.pagination,
    isLoading: result === undefined,
  };
}

/**
 * Hook for purchases list with pagination
 */
export function usePurchases(options?: {
  page?: number;
  limit?: number;
  status?: "pending" | "completed" | "failed" | "refunded";
}) {
  const result = useQuery(api.purchases.list, {
    page: options?.page ?? 1,
    limit: options?.limit ?? 20,
    status: options?.status,
  });

  return {
    purchases: result?.purchases ?? [],
    pagination: result?.pagination,
    isLoading: result === undefined,
  };
}

/**
 * Hook for products list
 */
export function useProducts(includeInactive?: boolean) {
  const products = useQuery(api.products.list, {
    includeInactive: includeInactive ?? false,
  });

  return {
    products: products ?? [],
    isLoading: products === undefined,
  };
}

/**
 * Hook for Stripe actions
 */
export function useStripeActions() {
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);
  const getPaymentDashboardLink = useAction(api.stripe.getPaymentDashboardLink);

  return {
    createCheckoutSession,
    getPaymentDashboardLink,
  };
}

/**
 * Hook for leads stats
 */
export function useLeadsStats() {
  const stats = useQuery(api.leads.getStats, {});
  return {
    stats,
    isLoading: stats === undefined,
  };
}

/**
 * Hook for recent leads
 */
export function useRecentLeads(limit?: number) {
  const leads = useQuery(api.leads.getRecent, { limit });
  return {
    leads: leads ?? [],
    isLoading: leads === undefined,
  };
}

/**
 * Hook for leads list with pagination
 */
export function useLeads(options?: { page?: number; limit?: number }) {
  const result = useQuery(api.leads.list, {
    page: options?.page ?? 1,
    limit: options?.limit ?? 20,
  });

  return {
    leads: result?.leads ?? [],
    pagination: result?.pagination,
    isLoading: result === undefined,
  };
}
