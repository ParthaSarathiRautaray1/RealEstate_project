export type Owner = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
};

export type PropertyImage = {
  id: string;
  property_id: string;
  url: string;
  public_id: string | null;
  alt: string | null;
  sort_order: number;
};

export type PropertyVideo = {
  id: string;
  property_id: string;
  youtube_url: string;
  title: string | null;
};

export type Review = {
  id: string;
  property_id: string;
  user_name: string;
  rating: number;
  review: string;
  approved: boolean;
  created_at: string;
};

export type Lead = {
  id: string;
  property_id: string | null;
  name: string;
  email: string;
  phone: string;
  budget: number | null;
  message: string | null;
  created_at: string;
  properties?: Pick<Property, "title" | "slug"> | null;
};

export type Property = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  property_type: string;
  location: string;
  latitude: number;
  longitude: number;
  owner_id: string | null;
  featured: boolean;
  status: "draft" | "published" | "sold";
  created_at: string;
  updated_at: string;
  owners?: Owner | null;
  property_images?: PropertyImage[];
  property_videos?: PropertyVideo[];
  reviews?: Review[];
};
