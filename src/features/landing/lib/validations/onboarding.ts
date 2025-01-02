import * as z from "zod";
import { siteConfig } from "@/app/config/siteConfig";

export const addressSchema = z.object({
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  country: z.enum(siteConfig.operationalCountries),
  postal_code: z.string(),
  state: z.string(),
});

export const schoolSchema = z.object({
  name: z.string().min(2, { message: "Should be more than 2 characters." }),
  logo: z.string().url(),
  domain: z
    .string()
    .min(5, { message: "Should not be more than 5 characters." }),
  verified: z.boolean().default(false),
  registeration_doc: z.string().url(),
  address: addressSchema,
});

export const adminSchema = z.object({
  firstname: z
    .string()
    .min(3, { message: "Should be more than 2 characters." }),
  lastname: z.string().min(3, { message: "Should be more than 2 characters." }),
  email: z.string().email(),
  phone: z.string().max(11, { message: "Enter a valid phone number" }),
  is_owner: z.boolean().default(true),
});

export const onboardingSchema = z.object({
  school: schoolSchema,
  admin: adminSchema,
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
