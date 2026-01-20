"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useEffect, useCallback } from "react";

// Session token storage key
const SESSION_TOKEN_KEY = "admin_session_token";

/**
 * Hook for managing admin authentication session
 */
export function useAdminAuth() {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(SESSION_TOKEN_KEY);
    setTokenState(storedToken);
    setIsLoading(false);
  }, []);

  // Validate session with the server
  const session = useQuery(
    api.adminUsers.validateSessionQuery,
    token ? { token } : "skip"
  );

  // Login action
  const loginAction = useAction(api.adminAuth.login);

  // Logout mutation
  const logoutMutation = useMutation(api.adminUsers.logout);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginAction({ email, password });
      if ("token" in result) {
        localStorage.setItem(SESSION_TOKEN_KEY, result.token);
        setTokenState(result.token);
        return { success: true, admin: result.admin };
      }
      return { success: false, error: result.error };
    },
    [loginAction]
  );

  const logout = useCallback(async () => {
    if (token) {
      await logoutMutation({ token });
    }
    localStorage.removeItem(SESSION_TOKEN_KEY);
    setTokenState(null);
  }, [token, logoutMutation]);

  const setToken = useCallback((newToken: string) => {
    localStorage.setItem(SESSION_TOKEN_KEY, newToken);
    setTokenState(newToken);
  }, []);

  return {
    token,
    admin: session ?? null,
    isAuthenticated: !!session,
    isLoading: isLoading || (token !== null && session === undefined),
    login,
    logout,
    setToken,
  };
}

/**
 * Hook to get the session token (for use in other hooks)
 */
export function useAdminToken(): string | null {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(SESSION_TOKEN_KEY));
  }, []);

  return token;
}

/**
 * Hook for checking if admin setup is needed (no admins exist)
 */
export function useAdminSetupNeeded() {
  const hasAnyAdmin = useQuery(api.adminUsers.hasAnyAdmin);
  return {
    setupNeeded: hasAnyAdmin === false,
    isLoading: hasAnyAdmin === undefined,
  };
}

/**
 * Hook for creating initial admin
 */
export function useCreateInitialAdmin() {
  const createInitialAdmin = useAction(api.adminAuth.createInitialAdmin);
  return createInitialAdmin;
}

/**
 * Hook for dashboard metrics
 */
export function useDashboardMetrics() {
  const token = useAdminToken();
  const metrics = useQuery(
    api.admin.getMetrics,
    token ? { token } : "skip"
  );
  return {
    metrics,
    isLoading: metrics === undefined,
  };
}

/**
 * Hook for revenue data with period selection
 */
export function useRevenue(period: "7d" | "30d" | "90d") {
  const token = useAdminToken();
  const revenue = useQuery(
    api.admin.getRevenue,
    token ? { token, period } : "skip"
  );
  return {
    revenue,
    isLoading: revenue === undefined,
  };
}

/**
 * Hook for sales by product
 */
export function useSalesByProduct() {
  const token = useAdminToken();
  const sales = useQuery(
    api.admin.getSalesByProduct,
    token ? { token } : "skip"
  );
  return {
    sales,
    isLoading: sales === undefined,
  };
}

/**
 * Hook for customer growth data
 */
export function useCustomerGrowth(period: "7d" | "30d" | "90d") {
  const token = useAdminToken();
  const growth = useQuery(
    api.admin.getCustomerGrowth,
    token ? { token, period } : "skip"
  );
  return {
    growth,
    isLoading: growth === undefined,
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
  const token = useAdminToken();
  const result = useQuery(
    api.customers.list,
    token
      ? {
          token,
          page: options?.page ?? 1,
          limit: options?.limit ?? 20,
          search: options?.search,
        }
      : "skip"
  );

  return {
    customers: result?.customers ?? [],
    pagination: result?.pagination,
    isLoading: result === undefined,
  };
}

/**
 * Hook for a single customer by ID
 */
export function useCustomer(customerId: Id<"customers"> | undefined) {
  const token = useAdminToken();
  const customer = useQuery(
    api.customers.getById,
    token && customerId ? { token, id: customerId } : "skip"
  );

  return {
    customer,
    isLoading: customer === undefined,
  };
}

/**
 * Hook for products list (public - no auth required)
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
 * Hook for products with sales stats (admin)
 */
export function useProductsWithStats() {
  const token = useAdminToken();
  const products = useQuery(
    api.products.listWithStats,
    token ? { token } : "skip"
  );

  return {
    products: products ?? [],
    isLoading: products === undefined,
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
  const token = useAdminToken();
  const result = useQuery(
    api.purchases.list,
    token
      ? {
          token,
          page: options?.page ?? 1,
          limit: options?.limit ?? 20,
          status: options?.status,
        }
      : "skip"
  );

  return {
    purchases: result?.purchases ?? [],
    pagination: result?.pagination,
    isLoading: result === undefined,
  };
}

/**
 * Hook for recent purchases (real-time updates)
 */
export function useRecentPurchases(limit?: number) {
  const token = useAdminToken();
  const purchases = useQuery(
    api.purchases.getRecent,
    token ? { token, limit } : "skip"
  );

  return {
    purchases: purchases ?? [],
    isLoading: purchases === undefined,
  };
}

/**
 * Hook for a single purchase by ID
 */
export function usePurchase(purchaseId: Id<"purchases"> | undefined) {
  const token = useAdminToken();
  const purchase = useQuery(
    api.purchases.getById,
    token && purchaseId ? { token, id: purchaseId } : "skip"
  );

  return {
    purchase,
    isLoading: purchase === undefined,
  };
}

/**
 * Hook for email logs list with pagination
 */
export function useEmailLogs(options?: {
  page?: number;
  limit?: number;
  status?: "pending" | "sent" | "delivered" | "failed" | "bounced";
}) {
  const token = useAdminToken();
  const result = useQuery(
    api.emailLogs.list,
    token
      ? {
          token,
          page: options?.page ?? 1,
          limit: options?.limit ?? 20,
          status: options?.status,
        }
      : "skip"
  );

  return {
    emails: result?.emails ?? [],
    pagination: result?.pagination,
    isLoading: result === undefined,
  };
}

/**
 * Hook for email statistics
 */
export function useEmailStats() {
  const token = useAdminToken();
  const stats = useQuery(
    api.emailLogs.getStats,
    token ? { token } : "skip"
  );

  return {
    stats,
    isLoading: stats === undefined,
  };
}

// ============ Mutations (all require token) ============

/**
 * Hook for product mutations
 */
export function useProductMutations() {
  const token = useAdminToken();
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const toggleProductActive = useMutation(api.products.toggleActive);
  const deleteProduct = useMutation(api.products.remove);

  return {
    createProduct: (args: Omit<Parameters<typeof createProduct>[0], "token">) =>
      token ? createProduct({ ...args, token }) : Promise.reject("No token"),
    updateProduct: (args: Omit<Parameters<typeof updateProduct>[0], "token">) =>
      token ? updateProduct({ ...args, token }) : Promise.reject("No token"),
    toggleProductActive: (id: Id<"products">) =>
      token ? toggleProductActive({ token, id }) : Promise.reject("No token"),
    deleteProduct: (id: Id<"products">) =>
      token ? deleteProduct({ token, id }) : Promise.reject("No token"),
  };
}

/**
 * Hook for customer mutations
 */
export function useCustomerMutations() {
  const token = useAdminToken();
  const createCustomer = useMutation(api.customers.create);
  const updateCustomer = useMutation(api.customers.update);

  return {
    createCustomer: (args: Omit<Parameters<typeof createCustomer>[0], "token">) =>
      token ? createCustomer({ ...args, token }) : Promise.reject("No token"),
    updateCustomer: (args: Omit<Parameters<typeof updateCustomer>[0], "token">) =>
      token ? updateCustomer({ ...args, token }) : Promise.reject("No token"),
  };
}

/**
 * Hook for purchase mutations
 */
export function usePurchaseMutations() {
  const token = useAdminToken();
  const updateStatus = useMutation(api.purchases.updateStatus);
  const markEmailSent = useMutation(api.purchases.markEmailSent);

  return {
    updateStatus: (id: Id<"purchases">, status: "pending" | "completed" | "failed" | "refunded") =>
      token ? updateStatus({ token, id, status }) : Promise.reject("No token"),
    markEmailSent: (id: Id<"purchases">) =>
      token ? markEmailSent({ token, id }) : Promise.reject("No token"),
  };
}

/**
 * Hook for admin user mutations
 */
export function useAdminUserMutations() {
  const token = useAdminToken();
  const createAdmin = useAction(api.adminAuth.createAdmin);
  const updateRole = useMutation(api.adminUsers.updateRole);
  const removeAdmin = useMutation(api.adminUsers.remove);
  const changePassword = useAction(api.adminAuth.changePassword);

  return {
    createAdmin: (args: { email: string; password: string; role: "admin" | "super_admin" }) =>
      token ? createAdmin({ ...args, token }) : Promise.reject("No token"),
    updateRole: (adminId: Id<"adminUsers">, role: "admin" | "super_admin") =>
      token ? updateRole({ token, adminId, role }) : Promise.reject("No token"),
    removeAdmin: (adminId: Id<"adminUsers">) =>
      token ? removeAdmin({ token, adminId }) : Promise.reject("No token"),
    changePassword: (currentPassword: string, newPassword: string) =>
      token ? changePassword({ token, currentPassword, newPassword }) : Promise.reject("No token"),
  };
}

// ============ Actions ============

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
 * Hook for email actions
 */
export function useEmailActions() {
  const sendProductDelivery = useAction(api.email.sendProductDelivery);
  const resendEmail = useAction(api.email.resendEmail);

  return {
    sendProductDelivery,
    resendEmail,
  };
}
