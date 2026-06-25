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
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters (letters, numbers, hyphens)."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  price: z.coerce.number({ invalid_type_error: "Enter a valid price." }).positive("Price must be greater than 0."),
  property_type: z.string().min(2, "Property type is required (e.g. Villa, Land)."),
  location: z.string().min(2, "Location is required."),
  latitude: z.coerce.number({ invalid_type_error: "Latitude is required — search an address or click the map." }),
  longitude: z.coerce.number({ invalid_type_error: "Longitude is required — search an address or click the map." }),
  owner_id: z.preprocess((value) => (value === "" ? null : value), z.string().uuid("Choose a valid owner.").optional().nullable()),
  featured: z.coerce.boolean().default(false),
  status: z.enum(["draft", "published", "sold"]).default("published"),
  image_urls: z.string().optional(),
  youtube_urls: z.string().optional()
});

export const ownerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email.").optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  avatar_url: z.string().url("Enter a valid URL (including https://).").optional().nullable().or(z.literal("")),
  bio: z.string().optional().nullable()
});

export const reviewSchema = z.object({
  property_id: z.string().uuid("Select a property."),
  user_name: z.string().min(2, "Name must be at least 2 characters."),
  rating: z.coerce.number().min(1, "Rating must be 1–5.").max(5, "Rating must be 1–5."),
  review: z.string().min(4, "Review must be at least 4 characters."),
  approved: z.coerce.boolean().default(true)
});

export type LeadInput = z.infer<typeof leadSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type OwnerInput = z.infer<typeof ownerSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
