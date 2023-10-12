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
  price: number;
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

type LanguageCode = {
  en?: string; //English
  fr?: string; //French
  it?: string; //Italian
  ar?: string; //Arabic
  zh?: string; //Chinese (Traditional)
  nl?: string; //Dutch
};

export interface DeliverooMenu {
  name: string;
  menu: {
    categories: DeliverooCategories[];
    items: DeliverooItems[];
    mealtimes: DeliverooMealtimes[];
    modifiers?: DeliverooModifiers[];
  };
  site_ids: string[];
}
export interface TimePeriods {
  start: string; // 24hr time period
  end: string; // 24hr time period
}

export interface Schedule {
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  time_periods: TimePeriods[];
}

export interface Image {
  url: string;
}

export interface DeliverooMealtimes {
  id: string;
  name: LanguageCode;
  description?: LanguageCode;
  seo_description?: LanguageCode;
  image: Image;
  schedule: Schedule[];
  category_ids: string[];
}

export interface DeliverooCategories {
  id: string;
  name: LanguageCode;
  description?: LanguageCode;
  item_ids: string[];
}

export interface PriceInfo {
  price: number;
  overrides?: {
    type: "ITEM" | "MODIFIER" | "PICKUP_ITEM" | "PICKUP_MODIFIER";
    id: string;
    price: number;
  };
}

export interface NutritionalInfo {
  energy_kcal: {
    low: number;
    high: number;
    hfss: boolean;
  };
}

export interface DeliverooItems {
  id: string;
  name: LanguageCode;
  description?: LanguageCode;
  //Operational name the restaurant uses in-house for the item.
  operational_name?: string;
  price_info: PriceInfo;
  //PLU (price lookup code) for the item. This field is Mandatory if the menu linked to pos integrated site.
  plu: string;
  //IAN is the International Article Number provided by the partner.
  ian?: string;
  image?: Image;
  is_eligible_as_replacement?: boolean;
  is_eligible_for_substitution?: boolean;
  is_returnable?: boolean;
  tax_rate: string;
  modifier_ids?: string[];
  allergies?: string[];
  classifications?: string[];
  diets?: string[];
  nutritional_info?: NutritionalInfo;
  contains_alcohol: boolean;
  max_quantity?: number | null;
  highlights?: string[];
  type: "ITEM" | "CHOICE";
}

export interface DeliverooModifiers {
  id: string;
  name: LanguageCode;
  description?: LanguageCode;
  min_selection?: number;
  max_selection?: number;
  repeatable?: boolean;
  item_ids: string[];
}
