export interface User {
  id: number;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
  status: 'active' | 'inactive';
}

export interface City {
  id: number;
  name: string;
  slug: string;
  state?: string;
  country?: string;
  description?: string;
  hero_image?: string;
  mobile_image?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  status: 'published' | 'draft' | 'archived';
  sort_order: number;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  robots?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  image?: string;
  mobile_image?: string;
  icon?: string;
  status: 'published' | 'draft' | 'archived';
  is_featured: boolean;
  sort_order: number;
  published_at?: string | null;
  created_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  robots?: string;
  design_posts_count?: number;
}

export interface DesignPostImage {
  id: number;
  design_post_id: number;
  image: string;
  thumbnail?: string;
  alt_text?: string;
  title?: string;
  caption?: string;
  sort_order: number;
  is_primary: boolean;
  is_mobile: boolean;
}

export interface DesignPostFeature {
  id: number;
  design_post_id: number;
  feature: string;
  sort_order: number;
}

export interface DesignPostSpecification {
  id: number;
  design_post_id: number;
  label: string;
  value: string;
  sort_order: number;
}

export interface DesignPost {
  id: number;
  category_id: number;
  category_ids?: number[];
  category?: Category;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  content?: string;
  style?: string;
  room_type?: string;
  layout?: string;
  dimensions?: string;
  colour?: string;
  material?: string;
  finish?: string;
  budget_min?: number;
  budget_max?: number;
  property_type?: string;
  area?: string;
  city_id?: number;
  city_ids?: number[];
  city?: City;
  location?: string;
  featured_image?: string;
  primary_image?: DesignPostImage;
  images?: DesignPostImage[];
  specifications?: DesignPostSpecification[];
  features?: DesignPostFeature[];
  related_posts?: DesignPost[];
  status: 'published' | 'draft' | 'archived';
  is_featured: boolean;
  sort_order: number;
  published_at?: string | null;
  views: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  robots?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  image?: string;
  gallery?: string[];
  icon?: string;
  price_from?: number;
  is_featured: boolean;
  status: 'published' | 'draft';
  city_id?: number;
  city?: City;
}

export interface ProjectImage {
  id: number;
  project_id: number;
  image: string;
  caption?: string;
  sort_order: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  client_name?: string;
  city_id?: number;
  city?: City;
  property_type?: string;
  area?: string;
  budget?: string;
  duration?: string;
  description?: string;
  featured_image?: string;
  images?: ProjectImage[];
  completion_date?: string;
  status: 'published' | 'draft';
  is_featured: boolean;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  author?: string;
  category_id?: number;
  category?: BlogCategory;
  status: 'published' | 'draft';
  is_featured: boolean;
  published_at?: string;
  created_at?: string;
}

export interface Testimonial {
  id: number;
  client_name: string;
  city_id?: number;
  city?: City;
  project_type?: string;
  review: string;
  rating: number;
  image?: string;
  status: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category_slug?: string;
  city_id?: number;
  sort_order: number;
}

export interface Lead {
  id: number;
  type: string;
  name: string;
  email?: string;
  phone: string;
  city_id?: number;
  city?: City;
  property_type?: string;
  requirement?: string;
  budget?: string;
  message?: string;
  source?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Closed';
  assigned_to?: string;
  notes?: string;
  created_at?: string;
}

export interface MegaMenuItem {
  id: number;
  label: string;
  url?: string;
  icon?: string;
  image?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

export interface MegaMenuColumn {
  id: number;
  title?: string;
  sort_order: number;
  items: MegaMenuItem[];
}

export interface MenuItem {
  id: number;
  menu_id: number;
  parent_id?: number;
  label: string;
  url?: string;
  type: 'link' | 'category' | 'city' | 'megamenu';
  icon?: string;
  image?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  open_new_tab: boolean;
  children?: MenuItem[];
  mega_columns?: MegaMenuColumn[];
  megaColumns?: MegaMenuColumn[];
}

export interface Media {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  path: string;
  url: string;
  alt_text?: string;
  title?: string;
  caption?: string;
  folder: string;
  created_at: string;
}

export interface SeoMetadata {
  id: number;
  path: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  robots?: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content?: string;
  sections?: any[];
  status: 'published' | 'draft';
  published_at?: string | null;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  robots?: string;
  created_at?: string;
  updated_at?: string;
}

