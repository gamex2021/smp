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
import type * as actions_document from "../actions/document.js";
import type * as actions_notifications from "../actions/notifications.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as lib_utils from "../lib/utils.js";
import type * as mutations_academic from "../mutations/academic.js";
import type * as mutations_address from "../mutations/address.js";
import type * as mutations_announcements from "../mutations/announcements.js";
import type * as mutations_class from "../mutations/class.js";
import type * as mutations_document from "../mutations/document.js";
import type * as mutations_fees from "../mutations/fees.js";
import type * as mutations_file from "../mutations/file.js";
import type * as mutations_helpers from "../mutations/helpers.js";
import type * as mutations_landingPage from "../mutations/landingPage.js";
import type * as mutations_notifications from "../mutations/notifications.js";
import type * as mutations_payment from "../mutations/payment.js";
import type * as mutations_school from "../mutations/school.js";
import type * as mutations_student from "../mutations/student.js";
import type * as mutations_subject from "../mutations/subject.js";
import type * as mutations_teacher from "../mutations/teacher.js";
import type * as mutations_user from "../mutations/user.js";
import type * as mutations_workspace from "../mutations/workspace.js";
import type * as otp_resendOtp from "../otp/resendOtp.js";
import type * as queries_academic from "../queries/academic.js";
import type * as queries_announcements from "../queries/announcements.js";
import type * as queries_class from "../queries/class.js";
import type * as queries_document from "../queries/document.js";
import type * as queries_fees from "../queries/fees.js";
import type * as queries_group from "../queries/group.js";
import type * as queries_helpers from "../queries/helpers.js";
import type * as queries_landingPage from "../queries/landingPage.js";
import type * as queries_matrics from "../queries/matrics.js";
import type * as queries_payment from "../queries/payment.js";
import type * as queries_school from "../queries/school.js";
import type * as queries_student from "../queries/student.js";
import type * as queries_subject from "../queries/subject.js";
import type * as queries_teacher from "../queries/teacher.js";
import type * as queries_user from "../queries/user.js";
import type * as queries_workspace from "../queries/workspace.js";
import type * as schedulers_academic from "../schedulers/academic.js";
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
  "actions/document": typeof actions_document;
  "actions/notifications": typeof actions_notifications;
  auth: typeof auth;
  http: typeof http;
  "lib/utils": typeof lib_utils;
  "mutations/academic": typeof mutations_academic;
  "mutations/address": typeof mutations_address;
  "mutations/announcements": typeof mutations_announcements;
  "mutations/class": typeof mutations_class;
  "mutations/document": typeof mutations_document;
  "mutations/fees": typeof mutations_fees;
  "mutations/file": typeof mutations_file;
  "mutations/helpers": typeof mutations_helpers;
  "mutations/landingPage": typeof mutations_landingPage;
  "mutations/notifications": typeof mutations_notifications;
  "mutations/payment": typeof mutations_payment;
  "mutations/school": typeof mutations_school;
  "mutations/student": typeof mutations_student;
  "mutations/subject": typeof mutations_subject;
  "mutations/teacher": typeof mutations_teacher;
  "mutations/user": typeof mutations_user;
  "mutations/workspace": typeof mutations_workspace;
  "otp/resendOtp": typeof otp_resendOtp;
  "queries/academic": typeof queries_academic;
  "queries/announcements": typeof queries_announcements;
  "queries/class": typeof queries_class;
  "queries/document": typeof queries_document;
  "queries/fees": typeof queries_fees;
  "queries/group": typeof queries_group;
  "queries/helpers": typeof queries_helpers;
  "queries/landingPage": typeof queries_landingPage;
  "queries/matrics": typeof queries_matrics;
  "queries/payment": typeof queries_payment;
  "queries/school": typeof queries_school;
  "queries/student": typeof queries_student;
  "queries/subject": typeof queries_subject;
  "queries/teacher": typeof queries_teacher;
  "queries/user": typeof queries_user;
  "queries/workspace": typeof queries_workspace;
  "schedulers/academic": typeof schedulers_academic;
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
