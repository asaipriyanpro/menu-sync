export interface DoorDashMenu {
  reference?: string;
  store: {
    merchant_supplied_id: string;
    provider_type: string;
  };
  open_hours: OpenHours[] | [];
  special_hours: SpecialHours[] | [];
  menu: Menu;
}

export interface OpenHours {
  day_index: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  start_time: string;
  end_time: string;
}

export interface SpecialHours {
  date: string;
  closed: boolean;
  start_time: string;
  end_time: string;
}

export interface ItemSpecialHours extends OpenHours {
  start_date: string;
  end_date: string;
}

export interface NutritionalInfo {
  calorific_info: {
    display_type: string;
    lower_range: number;
    higher_range: number;
  };
}

export interface DishInfo {
  nutritional_info: {
    calorific_info: {
      display_type: string;
      lower_range: number;
      higher_range: number;
    };
  };
  classification_info: {
    has_side: boolean;
    is_hot: boolean;
    is_entree: boolean;
    has_alcoholic_items: boolean;
    service_types: string[];
    classification_tags: [
      "TAG_KEY_DIETARY_VEGETARIAN",
      "TAG_KEY_DIETARY_VEGAN",
      "TAG_KEY_DIETARY_GLUTEN_FREE"
    ];
  };
}

export interface Menu {
  name: string;
  subtitle?: string;
  merchant_supplied_id?: string; //Our store ID
  active?: boolean;
  categories?: MenuCategory[];
}

export interface MenuCategory {
  name: string;
  subtitle?: string;
  active?: boolean;
  sort_id?: number;
  merchant_supplied_id: string;
  items: MenuItem[];
}

export interface MenuItem {
  name: string;
  description?: string;
  merchant_supplied_id: string;
  active?: boolean;
  is_alcohol?: boolean;
  is_bike_friendly?: boolean;
  sort_id?: number;
  price: number;
  base_price?: number;
  item_special_hours?: ItemSpecialHours[];
  tax_rate?: string;
  tax_category?: string;
  original_image_url: string; //Max 2MB allowed
  dish_info?: DishInfo;
  extras?: ItemExtras[];
}

export interface ItemExtras {
  name: string;
  merchant_supplied_id: string;
  active?: boolean;
  sort_id?: number;
  min_num_options?: number;
  max_num_options?: number;
  num_free_options?: number;
  min_option_choice_quantity?: number;
  max_option_choice_quantity?: number;
  min_aggregate_options_quantity?: number;
  max_aggregate_options_quantity?: number;
  options?: ItemOptions[];
}
export interface ItemOptions {
  name: string;
  description?: string;
  merchant_supplied_id: string;
  active?: boolean;
  sort_id?: number;
  price: number;
  base_price?: number;
  default?: boolean;
  quantity_info?: {
    default_quantity: number;
    charge_above: number;
  };
  extras?: ItemExtras[];
}

/**
 * Foodhub Menu Types
 */
export interface StoreInfo {
  id: number;
  name: string;
  host: string;
  description: string;
  phone: string;
  logo_url: string;
  country_id: number;
  iso3: string;
}

export interface StoreAvailability {
  service_type: string;
  business_date: string;
  day: string;
  open_at: string;
  close_at: string;
}
export interface FoodhubCagtegory {
  id: number;
  host: string;
  name: string;
  pos: number;
  pos_back: number;
  pos_receipt: number;
  background_color: string;
  font_color: string;
  shrink: number;
  hidden: string;
  collection: number;
  delivery: number;
  mip_id: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  coupon_allowed: number;
  collection_discount_allowed: number;
  online_discount_allowed: number;
  added: string;
  exclude_free: number;
  second_language_name: string;
  hidden_fix: string;
  printer: number;
  section: number;
  food_type_id: string | null;
  is_print_label: string;
  updated_at: string;
  food_type: string | null;
  sections: string | null;
  created_by: string | null;
  show_online: number;
  is_vat_included: string;
  is_schedule: number;
  region_tax_id: string | null;
  schedule: [];
  subcat: FHSubCategory[];
}

export interface FHCategory {
  id: number;
  host: string;
  name: string;
  pos: number;
  pos_back: number;
  pos_receipt: number;
  background_color: string;
  font_color: string;
  shrink: number;
  hidden: string;
  collection: number;
  delivery: number;
  mip_id: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  coupon_allowed: number;
  collection_discount_allowed: number;
  online_discount_allowed: number;
  added: string;
  exclude_free: number;
  second_language_name: string;
  hidden_fix: string;
  printer: number;
  section: number;
  food_type_id: string;
  is_print_label: string;
  updated_at: string;
  food_type: string;
  sections: string;
  created_by: string;
  show_online: number;
  is_vat_included: string;
  is_schedule: number;
  region_tax_id: string;
  schedule: [];
}

export interface FHSubCategory {
  id: number;
  host: string;
  name: string;
  addon_type: number;
  subcat_addon_cat: number;
  description: string;
  image: string;
  aws_image: string;
  image_backup: string;
  category: number;
  addon: string;
  background_color: string;
  font_color: string;
  pos: number;
  pos_back: number;
  delivery: number;
  collection: number;
  show_online: number;
  menu_inputter_id: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  coupon_allowed: number;
  collection_discount_allowed: number;
  online_discount_allowed: number;
  added: string;
  user_id: string;
  page: string;
  modified: string;
  modified_by: string;
  modified_page: string;
  offer_all: string;
  exclude_free: number;
  second_language_name: string;
  second_language_description: string;
  food_type: string;
  sections: string | null;
  is_vat_included: string;
  is_print_label: string;
  additional_charges: string;
  is_schedule: number;
  region_tax_id: string | null;
  is_image_approved: string;
  schedule: [];
  item: FHItem[];
}

export interface FHItem {
  id: number;
  host: string;
  item_addon_cat: string;
  name: string;
  description: string;
  information: string | null;
  price: string;
  subcat: number;
  image: string;
  aws_image: string;
  image_backup: string;
  addon_type: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  delivery: number;
  collection: number;
  show_online: number;
  background_color: string;
  font_color: string;
  pos: number;
  offer: string;
  btn_name: string;
  mip_id: number;
  coupon_allowed: number;
  collection_discount_allowed: number;
  online_discount_allowed: number;
  item_code: string;
  added: string;
  user_id: string;
  page: string;
  modified: string;
  modified_by: string;
  modified_page: string;
  vat: string;
  exclude_free: number;
  second_language_name: string;
  second_language_description: string;
  printer: number;
  section: number;
  is_print_label: string;
  is_vat_included: string;
  food_type: string;
  sections: null;
  half_and_half_status: number;
  half_and_half_charges: null;
  is_schedule: number;
  region_tax_id: null;
  is_image_approved: string;
  schedule: [];
  number_of_servings: string;
  nutrition: any;
  allergies: string[];
}

export interface FHAddonCategoryMapCategory {
  id: number;
  host: string;
  name: string;
  description: string;
  next_move: string;
  subcat_id: number;
  added: string;
  second_language_name: string;
  second_language_description: string;
  popup_menu_header_id: number | null;
  extra_toppings_price: number | null;
  updated_at: string;
  item_id: number | null;
  pos: number;
  free_count: number;
  region_tax_id: number | null;
}

export interface FHAddon {
  id: number;
  host: string;
  item_addon_cat: number;
  name: string;
  type: "radio" | "multi"; // enum
  price: string;
  background_color: string;
  font_color: string;
  pos: number;
  next_move: string;
  offer: "NONE"; // enum
  created_date: string;
  user: string;
  sys: string;
  show_online: number;
  show_on_receipt: number;
  second_language_name: string;
  updated_at: string;
  is_print_label: string;
  region_tax_id: string | null;
  priceHikePercent: number;
}

export interface FHAddonCategoryMap {
  [id: string]: {
    category: FHAddonCategoryMapCategory;
    addon: FHAddon[];
  };
}
