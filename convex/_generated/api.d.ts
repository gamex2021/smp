/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as mutations_address from "../mutations/address.js";
import type * as mutations_class from "../mutations/class.js";
import type * as mutations_file from "../mutations/file.js";
import type * as mutations_helpers from "../mutations/helpers.js";
import type * as mutations_school from "../mutations/school.js";
import type * as mutations_user from "../mutations/user.js";
import type * as otp_resendOtp from "../otp/resendOtp.js";
import type * as queries_class from "../queries/class.js";
import type * as queries_group from "../queries/group.js";
import type * as queries_helpers from "../queries/helpers.js";
import type * as queries_matrics from "../queries/matrics.js";
import type * as queries_school from "../queries/school.js";
import type * as queries_user from "../queries/user.js";
import type * as uploads from "../uploads.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  "mutations/address": typeof mutations_address;
  "mutations/class": typeof mutations_class;
  "mutations/file": typeof mutations_file;
  "mutations/helpers": typeof mutations_helpers;
  "mutations/school": typeof mutations_school;
  "mutations/user": typeof mutations_user;
  "otp/resendOtp": typeof otp_resendOtp;
  "queries/class": typeof queries_class;
  "queries/group": typeof queries_group;
  "queries/helpers": typeof queries_helpers;
  "queries/matrics": typeof queries_matrics;
  "queries/school": typeof queries_school;
  "queries/user": typeof queries_user;
  uploads: typeof uploads;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
