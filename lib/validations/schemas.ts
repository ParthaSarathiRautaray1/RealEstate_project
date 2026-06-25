import { z } from "zod";

export const leadSchema = z.object({
  property_id: z.preprocess((value) => value === "" ? null : value, z.string().uuid().optional().nullable()),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone number is required"),
  budget: z.preprocess((value) => value === "" ? null : value, z.coerce.number().positive().optional().nullable()),
  message: z.string().max(1000).optional().nullable()
});

export const propertySchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(20),
  price: z.coerce.number().positive(),
  property_type: z.string().min(2),
  location: z.string().min(2),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  owner_id: z.string().uuid().optional().nullable(),
  featured: z.coerce.boolean().default(false),
  status: z.enum(["draft", "published", "sold"]).default("published"),
  image_urls: z.string().optional(),
  youtube_urls: z.string().optional()
});

export const ownerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  avatar_url: z.string().url().optional().nullable().or(z.literal("")),
  bio: z.string().optional().nullable()
});

export const reviewSchema = z.object({
  property_id: z.string().uuid(),
  user_name: z.string().min(2),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(4),
  approved: z.coerce.boolean().default(true)
});

export type LeadInput = z.infer<typeof leadSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type OwnerInput = z.infer<typeof ownerSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
