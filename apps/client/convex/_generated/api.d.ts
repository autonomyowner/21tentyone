/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as adminAuth from "../adminAuth.js";
import type * as customers from "../customers.js";
import type * as email from "../email.js";
import type * as emailHelpers from "../emailHelpers.js";
import type * as emailLogs from "../emailLogs.js";
import type * as http from "../http.js";
import type * as products from "../products.js";
import type * as purchases from "../purchases.js";
import type * as stripe from "../stripe.js";
import type * as stripeHelpers from "../stripeHelpers.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  adminAuth: typeof adminAuth;
  customers: typeof customers;
  email: typeof email;
  emailHelpers: typeof emailHelpers;
  emailLogs: typeof emailLogs;
  http: typeof http;
  products: typeof products;
  purchases: typeof purchases;
  stripe: typeof stripe;
  stripeHelpers: typeof stripeHelpers;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
