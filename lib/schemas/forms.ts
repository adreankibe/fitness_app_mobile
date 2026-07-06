import { z } from "zod";

export const organizationRoleSchema = z.enum([
  "OWNER",
  "COACH",
  "ASSISTANT_COACH",
  "ATHLETE",
  "TRIAL_USER",
  "APPLICANT",
]);

const slugRegex = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/;

export const completeProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  acceptTerms: z.boolean().refine((value) => value, {
    message: "Accept terms to continue.",
  }),
});

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(3).max(60).regex(slugRegex),
  timezone: z.string().trim().min(1).max(80),
});

export const inviteMemberSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  role: organizationRoleSchema,
  teamId: z.string().optional(),
  expiresInDays: z.number().int().min(1).max(90),
  maxRedemptions: z.number().int().min(1).max(100),
  message: z.string().max(500).optional(),
});

export const teamSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().max(500).optional(),
});

export const organizationSettingsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(3).max(60).regex(slugRegex),
  timezone: z.string().trim().min(1).max(80),
  defaultInviteRole: organizationRoleSchema,
  allowAthleteSelfJoin: z.boolean(),
  requireCoachApprovalForBuyers: z.boolean(),
});

export const profileEditSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});
