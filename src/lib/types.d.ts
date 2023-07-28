export interface AuthorizerContext {
  sub: string;
  aud: string;
  countryId: string;
}

export interface EmailData {
  to: string[];
  from: string;
  subject: string;
  htmlBody: string;
}

interface UrbanPiperCategoryTranslation {
  language: string;
  name: string;
  description: string;
}

interface PriceConfig {
  basePrice: number;
  baseIncreasePercentage?: number;
  vatPercentage?: number;
}

interface UrbanPiperItemTranslation {
  language: string;
  title: string;
  description: string;
}

interface KeyValueObject {
  key: string;
  value: string;
}

interface KeyValueGroup {
  group: string;
  key_value_data: KeyValueObject[];
}

interface UrbanPiperItem {
  ref_id: string;
  title: string;
  ref_title?: string;
  available: boolean;
  description: string;
  weight?: number;
  sold_at_store: boolean;
  sort_order: number;
  serves?: number;
  external_price?: number;
  price: number; // looks like pounds rather than pence (for example)
  markup_price?: number;
  current_stock: number; // seen -1 as value
  recommended?: boolean;
  food_type: "1" | "2" | "3" | "4";
  category_ref_ids: string[]; // I assume this is the cat/subcat the item appears in
  fulfillment_modes?: string[]; // delivery / pickup
  images?: UrbanPiperImage[]; // perhaps optional given next field
  img_url: string;
  translations: UrbanPiperItemTranslation[];
  tags?: TagMap;
  included_platforms?: string[]; // ['ziggy', 'amazon', 'zomato']
  key_value_groups?: KeyValueGroup[];
  clear_option_groups?: boolean; // ?
}

interface UrbanPiperImage {
  tag: string; // seen 'default' - otherwise used to specify which partner the image is for 'zomato' / 'zwiggy' etc
  url: string;
}

type TagMap = { [key: string]: string[] };

interface UrbanPiperCategory {
  ref_id: string;
  parent_ref_id?: string; // for nesting
  name: string;
  description: string;
  sort_order: number;
  active: boolean;
  img_url: string;
  translations?: UrbanPiperCategoryTranslation[];
}

interface UrbanPiperOptionGroup {
  ref_id: string;
  title: string;
  description?: string;
  ref_title: string;
  food_type?: "1" | "2" | "3" | "4";
  min_selectable: number;
  max_selectable: number;
  clear_item_ref_ids?: boolean;
  display_inline?: boolean;
  active: boolean;
  item_ref_ids: string[]; // Assuming this is the items for which this option group will be shown
  sort_order: number;
  translations?: UrbanPiperItemTranslation[];
}

interface UrbanPiperOption {
  ref_id: string;
  title: string;
  ref_title?: string;
  description: string;
  available: boolean;
  weight?: number;
  recommended?: boolean;
  price: number;
  sold_at_store: boolean;
  sort_order?: number;
  food_type?: string; // 1  2 3 4
  clear_opt_grp_ref_ids?: boolean;
  opt_grp_ref_ids: string[]; // OptionGroups this option appears in
  nested_opt_grps?: string[]; // option_group ref_ids
  translations?: UrbanPiperItemTranslation[];
  key_value_groups?: KeyValueGroup[];
}

interface UrbanPiperTaxStructure {
  value: number;
}

interface UrbanPiperTax {
  code: string;
  title: string;
  description: string;
  active: boolean;
  structure: UrbanPiperTaxStructure;
  item_ref_ids: string[];
}

interface UrbanPiperChargeStructure {
  applicable_on?: string; // eg 'item.quantity'
  value: number;
}

interface UrbanPiperCharge {
  code: string;
  title: string;
  description: string;
  active: boolean;
  structure: UrbanPiperChargeStructure;
  fulfillment_modes: string[]; // 'delivery' 'pickup' ...
  excluded_platforms: string[]; // eg 'amazon'
  item_ref_ids: string[];
}

interface UrbanPiperPayload {
  categories: UrbanPiperCategory[];
  items: UrbanPiperItem[];
  option_groups: UrbanPiperOptionGroup[];
  options: UrbanPiperOption[];
  taxes: UrbanPiperTax[];
  charges: UrbanPiperCharge[];
}

interface PriceConfig {
  basePrice: number;
  baseIncreasePercentage?: number;
  vatPercentage?: number;
}
