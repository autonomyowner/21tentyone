"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Initialize Convex client
const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

interface ConvexClientProviderProps {
  children: ReactNode;
}

/**
 * ConvexClientProvider wraps the app with Convex.
 * Use this at the root of your app to enable Convex throughout.
 */
export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

// Export the convex client for direct use if needed
export { convex };
