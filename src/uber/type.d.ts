export interface AuthorizerContext {
  sub: string;
  aud: string;
  countryId: string;
}

/**
 * Access Token, common for client credentials and user credentials for pos provisioning
 */
export interface UberAccessToken {
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  scope: string;
  access_token: string;
}

/**
 *
 */
export interface DeprovisionDetail {
  store_id: string;
  reason_id: string;
  reason?: string;
  addtional?: string;
}

/**
 * DynamoDB Client Record Shape
 */
export interface ClientRecord {
  basePriceIncreasePercentage: number;
  storeId: string;
  token: UberAccessToken;
  uberStoreId?: string | undefined;
  menuSyncEnabled: boolean | undefined;
  autoAcceptOrderOnUber: boolean | undefined;
}

/**
 * SSM Configuration Shape
 */
export interface ConfigSchema extends Record<string, any> {
  client_id: string;
  client_secret: string;
  scope: string;
  token?: UberAccessToken;
  google_api_key?: string;
  providers?: any;
  pause_order_options?: any;
  deprovision_options?: any;
}

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

export interface UberOrder {
  id: string;
  current_state: string;
  display_id: string;
  store: UberStore;
  eater: UberEater;
  eaters: { first_name: string; id: string }[];
  cart: UberCart;
  payment: UberPayment;
  placed_at: string;
  estimated_ready_for_pickup_at: string;
  type: "PICK_UP" | "DINE_IN" | "DELIVERY_BY_UBER" | "DELIVERY_BY_RESTAURANT";
  brand: string;
  deliveries: Deliveries[] | [];
}

export interface Deliveries {
  first_name?: string;
}

export interface UberCart {
  items: UberItem[] | [];
  special_instructions?: string;
}

export interface UberItem {
  id: string;
  instance_id?: string;
  title: string;
  external_data?: string;
  quantity: number;
  price?: priceDetails;
  selected_modifier_groups: UberModifierGroup[] | null;
  special_instructions?: string;
  discount_item?: number;
  offer?: string;
}

export interface priceDetails {
  unit_price?: formattedPriceDetails;
  total_price?: formattedPriceDetails;
  base_unit_price?: formattedPriceDetails;
  base_total_price?: formattedPriceDetails;
}

export interface formattedPriceDetails {
  amount: number;
  currency_code: string;
  formatted_amount: string;
}

export interface UberModifierGroup {
  id: string;
  title: string;
  external_data?: string;
  quantity?: number;
  price?: priceDetails;
  selected_items: UberItem[];
}

export interface UberStore {
  id: string;
  name: string;
  external_reference_id?: string;
  location?: {
    address: string;
    city: string;
    country: string;
    postal_code: string;
    state: string;
    latitude: number;
    longitude: number;
  };
  contact_emails?: string[];
  raw_hero_url?: string;
  price_bucket?: "$" | "$$" | "$$$" | "$$$$" | "$$$$$";
  avg_prep_time?: number;
  status?: "active";
  timezone?: string;
}

export interface UberEater {
  first_name: string;
  phone?: string | "";
  phone_code?: string;
  last_name?: string;
  delivery?: UberDeliveryDetails;
}

export interface UberDeliveryDetails {
  location: UberLocationDetails;
  type: string;
  notes?: string;
}

export interface UberLocationDetails {
  google_place_id?: string;
  type: string;
  latitude?: number;
  longitude?: number;
  unit_number?: string;
  street_address?: string;
  business_name?: string;
  title?: string;
}

export interface UberPayment {
  charges: UberPaymentCharges;
  promotions?: {
    promotions: Promotions[] | [];
  };
  accounting?: UberAccounting;
}

export interface UberAccounting {
  tax_remittance?: {
    tax?: UberTax;
  };
}
export interface UberTax {
  courier?: UberTaxValue[];
  eater?: UberTaxValue[];
  restaurant?: UberTaxValue[];
  uber?: UberTaxValue[];
}
export interface UberTaxValue {
  value?: {
    amount: number;
    currency_code: string;
    formatted_amount: string;
  };
}
export interface Promotions {
  promo_type?: string | null;
  promo_discount_value?: number | 0;
  discount_items: DiscountItems[] | [];
}

export interface DiscountItems {
  external_id: string;
  discounted_quantity?: number | 0;
}

export interface GoogleAddressFormat {
  result?: formattedAddress;
  results?: formattedAddress[];
  status: string;
}

export interface formattedAddress {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name?: string;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: [string];
}

export interface UberPaymentCharges {
  total: formattedPriceDetails;
  sub_total: formattedPriceDetails;
  tax?: formattedPriceDetails;
  total_fee?: formattedPriceDetails;
  tip?: formattedPriceDetails;
  delivery_fee?: formattedPriceDetails;
  total_promo_applied?: formattedPriceDetails;
  sub_total_promo_applied?: formattedPriceDetails;
  cash_amount_due?: formattedPriceDetails;
  tax_promo_applied?: formattedPriceDetails;
}

export interface MenuConfiguration {
  /** List of the store’s menus */
  menus: Menu[];
  /** List of the store’s menu categories */
  categories: Category[];
  /** List of the store’s items */
  items: Item[];
  /** List of the store’s modifier groups */
  modifier_groups: ModifierGroup[];
  display_options: DisplayOptions;
  menu_type?:
    | "MENU_TYPE_FULFILLMENT_DELIVERY"
    | "MENU_TYPE_FULFILLMENT_PICK_UP";
}

/** A collection of items available for sale from a restaurant at specified times */
export interface Menu {
  /** A unique identifying string for the menu, provided by the restaurant */
  id: string;
  title: MultiLanguageText;
  subtitle?: MultiLanguageText;
  /** The days and times of the day at which this menu should be made available */
  service_availability: ServiceAvailability[] | null;
  /** All of the IDs for the menu categories that will be made available while this menu is active */
  category_ids: string[];
}
/** Provides content for a string displayed to users in multiple languages */
export interface MultiLanguageText {
  /** A mapping from locale code to the translated text in each locale. At least one translation must be provided. When displaying text, we will first attempt to use the translation for the locale used by the user’s device, then, if not found, the restaurant’s locale, and finally the default locale for the city. If none of these are found, the first locale listed will be used. Locale codes should specify both language and country codes, e.g. "en_us" */
  translations?: { [key: string]: string };
}
/** Specifies menu availability on a specified day of the week */
export interface ServiceAvailability {
  /** The day of the week on which these hours will be applied */
  day_of_week:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  /** Whether the menu is available on the specified day */
  enabled?: boolean;
  /** The continuous time spans during which the menu is available */
  time_periods: TimePeriod[] | null;
}
/** Continuous time span on an individual day (finishes at 23:59) */
export interface TimePeriod {
  /** The time at which the menu becomes available, in 24-hour HH:MM format, e.g. "08:30", "23:00" */
  start_time?: string;
  /** The time at which the menu ceases to be available, in 24-hour HH:MM format, e.g. "08:30", "23:00" */
  end_time?: string;
}
/** A grouping that allows related items to be displayed in proximity to each other on a menu */
export interface Category {
  /** A unique identifying string for the category, provided by the restaurant */
  id: string;
  title: MultiLanguageText;
  subtitle?: MultiLanguageText;
  /** The top-level menu items available for sale within the category */
  entities: MenuEntity[];
}
/** Allows for specifying entities of different types from the menu, e.g. items and modifier groups */
export interface MenuEntity {
  /** The unique identifying string (id) for the item or modifier group being specified */
  id: string;
  /** The type of the entity being specified */
  type: "ITEM" | "MODIFIER_GROUP";
}
/** An individual object that can be ordered - either by itself or, when used within a modifier group, as a component of another item */
export interface Item {
  /** A unique identifying string for the item, provided by the restaurant */
  id: string;
  /** Free-form text field reserved for the restaurant’s use, e.g. for POS integrations */
  external_data?: string | null;
  title: MultiLanguageText;
  description?: MultiLanguageText;
  /** URL pointing to an image of the item. Image must be hosted on a secure connection (SSL), have a file size less than 8MB, be in JPEG or PNG format, and have both a width and height between 320px and 1144px */
  image_url?: string | null;
  price_info: PriceRules;
  quantity_info?: QuantityConstraintRules;
  suspension_info?: SuspensionRules;
  modifier_group_ids?: ModifierGroupsRules;
  tax_info: TaxInfo;
  nutritional_info?: Item_nutritional_info;
}
/** Specifies the price to charge for ordering the item */
export interface PriceRules {
  /** Price of the item in the lowest local currency denomination, e.g. cents */
  price?: number;
  /** Overrides for the price in different contexts */
  overrides?: PriceRules_overrides[] | null;
}
/** Applies constraints to the quantity in which an item can be ordered */
export interface QuantityConstraintRules {
  quantity?: QuantityConstraint;
  /** Overrides for the quantity constraints in different contexts */
  overrides?: QuantityConstraintRules_overrides[] | null;
}
/** A set of rules imposed upon the quantity values selectable by the user */
export interface QuantityConstraint {
  /** Minimum quantity allowed (inclusive) */
  min_permitted?: number | null;
  /** Maximum quantity allowed (inclusive) */
  max_permitted?: number | null;
  /** Default quantity that will be pre-selected */
  default_quantity?: number | null;
  /** When provided, the item price will only be charged per quantity unit in excess of this amount */
  charge_above?: number | null;
  /** When provided, the item price will be refunded per quantity unit chosen below this amount */
  refund_under?: number | null;
}
/** Suspends the item from sale for a specified period of time */
export interface SuspensionRules {
  suspension?: Suspension;
  /** Overrides for the suspension in different contexts */
  overrides?: SuspensionRules_overrides[] | null;
}
/** Describes why, and until when, an item is suspended from sale */
export interface Suspension {
  /** The time at which the item will return to being available for sale, specified as a Unix timestamp in seconds since Jan 1, 1970. A null value, or time in the past, indicates that an item is available - otherwise it will be shown as "Sold Out" and unavailable to order */
  suspend_until?: number | null;
  /** Describes the reason for the suspension */
  reason?: string | null;
}
/** Specifies the modifier groups to be associated with the item, allowing the user to make choices or bundle extras with their purchase */
export interface ModifierGroupsRules {
  /** A list of the identifying strings (ids) of all modifier groups associated with the item */
  ids: string[] | null;
  overrides?: ModifierGroupsRules_overrides[] | null;
}
/** Specifies the taxes applicable to the item */
export interface TaxInfo {
  /** The tax rate for the item, included in the price - must be between 0 and 100 inclusive */
  tax_rate?: number | null;
  /** Value-added tax rate for the item, additional to the price - must be between 0 and 100 inclusive */
  vat_rate_percentage?: number | null;
}
/** An object that represents an item's nutritional info */
export interface NutritionalInfo {
  lower_range?: number;
  upper_range?: number | null;
  display_type?:
    | "single_item"
    | "double_items"
    | "multiple_items"
    | "additive_item";
}
/** A grouping of items that can be selected as part of the purchase of a parent item, allowing the user to customize the item by making choices or bundling extras with their order */
export interface ModifierGroup {
  /** A unique identifying string for the modifier group, provided by the restaurant */
  id: string;
  /** Free-form text field reserved for the restaurant’s use, e.g. for POS integrations */
  external_data?: string | null;
  title: MultiLanguageText;
  quantity_info?: QuantityConstraintRules;
  /** A list of menu entity objects representing available item options for the modifier group - cannot include any menu entities with a type of 'MODIFIER_GROUP' */
  modifier_options?: MenuEntity[] | null;
  /** Describes how this modifier group should be initially displayed - whether fully expanded (the default setting if this field is not provided), or collapsed */
  display_type?: "expanded" | "collapsed";
}
/** Miscellaneous configuration settings for the display of all of the store’s menus */
export interface DisplayOptions {
  /** Whether to allow the user to supply instructions for preparing menu items to the restaurant - applies store-wide */
  disable_item_instructions?: boolean;
}
/** Nutritional information for the item */
export interface Item_nutritional_info {
  calories?: NutritionalInfo;
  kilojoules?: NutritionalInfo;
}
/** Overrides the item price in a specified context */
export interface PriceRules_overrides {
  /** Type of the context in which to override */
  context_type?: "MENU" | "ITEM" | "MODIFIER_GROUP";
  /** Identifying string (id) for the specified context */
  context_value?: string;
  /** Price of the item in the lowest local currency denomination, e.g. cents */
  price?: number;
}
/** Overrides the quantity constraints in a specified context */
export interface QuantityConstraintRules_overrides {
  /** Type of the context in which to override */
  context_type?: "MENU" | "ITEM" | "MODIFIER_GROUP";
  /** Identifying string (id) for the specified context */
  context_value?: string;
  quantity?: QuantityConstraint;
}
/** Overrides an item’s suspension in a specified context */
export interface SuspensionRules_overrides {
  /** Type of the context in which to override */
  context_type?: "MENU" | "ITEM" | "MODIFIER_GROUP";
  /** Identifying string (id) for the specified context */
  context_value?: string;
  suspension?: Suspension;
}
/** Overrides the modifier groups associated with an item in a specified context */
export interface ModifierGroupsRules_overrides {
  /** Type of the context in which to override */
  context_type?: "MENU" | "ITEM" | "MODIFIER_GROUP";
  /** Identifying string (id) for the specified context */
  context_value?: string;
  /** A list of the identifying strings (ids) of all modifier groups associated with the item in this context */
  ids?: string[];
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
  next_moves: string[];
}

export interface FoodhubAddonCategoryMapCategory {
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
  next_moves: string[];
}

export interface FoodhubAddon {
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
  next_moves: string[];
}

export interface FoodhubAddonCategoryMap {
  [id: string]: {
    category: FoodhubAddonCategoryMapCategory;
    addon: FoodhubAddon[];
  };
}

export interface FoodhubAddonCategoryMapV3 {
  categories: FoodhubAddonCategoryMapCategory[];
  addons: FoodhubAddon[];
}

export interface FoodHubMenu {
  menuType: "delivery" | "collection";
  categories: FoodhubCagtegory[];
  addonsV1: FoodhubAddonCategoryMap;
  addonsV3: FoodhubAddonCategoryMapV3;
  store: StoreInfo;
  storeAvailability: StoreAvailability[];
  priceHikePercent: number;
}

/** A collection of items available for sale from a restaurant at specified times */
export interface Menu {
  /** A unique identifying string for the menu, provided by the restaurant */
  id: string;
  title: MultiLanguageText;
  subtitle?: MultiLanguageText;
  /** The days and times of the day at which this menu should be made available */
  service_availability: ServiceAvailability[] | null;
  /** All of the IDs for the menu categories that will be made available while this menu is active */
  category_ids: string[];
}
/** Provides content for a string displayed to users in multiple languages */
export interface MultiLanguageText {
  /** A mapping from locale code to the translated text in each locale. At least one translation must be provided. When displaying text, we will first attempt to use the translation for the locale used by the user’s device, then, if not found, the restaurant’s locale, and finally the default locale for the city. If none of these are found, the first locale listed will be used. Locale codes should specify both language and country codes, e.g. "en_us" */
  translations?: { [key: string]: string };
}
/** Specifies menu availability on a specified day of the week */
export interface ServiceAvailability {
  /** The day of the week on which these hours will be applied */
  day_of_week:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  /** Whether the menu is available on the specified day */
  enabled?: boolean;
  /** The continuous time spans during which the menu is available */
  time_periods: TimePeriod[] | null;
}
/** Continuous time span on an individual day (finishes at 23:59) */
export interface TimePeriod {
  /** The time at which the menu becomes available, in 24-hour HH:MM format, e.g. "08:30", "23:00" */
  start_time?: string;
  /** The time at which the menu ceases to be available, in 24-hour HH:MM format, e.g. "08:30", "23:00" */
  end_time?: string;
}
/** A grouping that allows related items to be displayed in proximity to each other on a menu */
export interface Category {
  /** A unique identifying string for the category, provided by the restaurant */
  id: string;
  title: MultiLanguageText;
  subtitle?: MultiLanguageText;
  /** The top-level menu items available for sale within the category */
  entities: MenuEntity[];
}
/** Allows for specifying entities of different types from the menu, e.g. items and modifier groups */
export interface MenuEntity {
  /** The unique identifying string (id) for the item or modifier group being specified */
  id: string;
  /** The type of the entity being specified */
  type: "ITEM" | "MODIFIER_GROUP";
}
/** An individual object that can be ordered - either by itself or, when used within a modifier group, as a component of another item */
export interface Item {
  /** A unique identifying string for the item, provided by the restaurant */
  id: string;
  /** Free-form text field reserved for the restaurant’s use, e.g. for POS integrations */
  external_data?: string | null;
  title: MultiLanguageText;
  description?: MultiLanguageText;
  /** URL pointing to an image of the item. Image must be hosted on a secure connection (SSL), have a file size less than 8MB, be in JPEG or PNG format, and have both a width and height between 320px and 1144px */
  image_url?: string | null;
  price_info: PriceRules;
  quantity_info?: QuantityConstraintRules;
  suspension_info?: SuspensionRules;
  modifier_group_ids?: ModifierGroupsRules;
  tax_info: TaxInfo;
  nutritional_info?: Item_nutritional_info;
}
/** Specifies the price to charge for ordering the item */
export interface PriceRules {
  /** Price of the item in the lowest local currency denomination, e.g. cents */
  price?: number;
  /** Overrides for the price in different contexts */
  overrides?: PriceRules_overrides[] | null;
}
/** Applies constraints to the quantity in which an item can be ordered */
export interface QuantityConstraintRules {
  quantity?: QuantityConstraint;
  /** Overrides for the quantity constraints in different contexts */
  overrides?: QuantityConstraintRules_overrides[] | null;
}
/** A set of rules imposed upon the quantity values selectable by the user */
export interface QuantityConstraint {
  /** Minimum quantity allowed (inclusive) */
  min_permitted?: number | null;
  /** Maximum quantity allowed (inclusive) */
  max_permitted?: number | null;
  /** Default quantity that will be pre-selected */
  default_quantity?: number | null;
  /** When provided, the item price will only be charged per quantity unit in excess of this amount */
  charge_above?: number | null;
  /** When provided, the item price will be refunded per quantity unit chosen below this amount */
  refund_under?: number | null;
}
/** Suspends the item from sale for a specified period of time */
export interface SuspensionRules {
  suspension?: Suspension;
  /** Overrides for the suspension in different contexts */
  overrides?: SuspensionRules_overrides[] | null;
}
/** Describes why, and until when, an item is suspended from sale */
export interface Suspension {
  /** The time at which the item will return to being available for sale, specified as a Unix timestamp in seconds since Jan 1, 1970. A null value, or time in the past, indicates that an item is available - otherwise it will be shown as "Sold Out" and unavailable to order */
  suspend_until?: number | null;
  /** Describes the reason for the suspension */
  reason?: string | null;
}
/** Specifies the modifier groups to be associated with the item, allowing the user to make choices or bundle extras with their purchase */
export interface ModifierGroupsRules {
  /** A list of the identifying strings (ids) of all modifier groups associated with the item */
  ids: string[] | null;
  overrides?: ModifierGroupsRules_overrides[] | null;
}
/** Specifies the taxes applicable to the item */
export interface TaxInfo {
  /** The tax rate for the item, included in the price - must be between 0 and 100 inclusive */
  tax_rate?: number | null;
  /** Value-added tax rate for the item, additional to the price - must be between 0 and 100 inclusive */
  vat_rate_percentage?: number | null;
}
/** An object that represents an item's nutritional info */
export interface NutritionalInfo {
  lower_range?: number;
  upper_range?: number | null;
  display_type?:
    | "single_item"
    | "double_items"
    | "multiple_items"
    | "additive_item";
}
/** A grouping of items that can be selected as part of the purchase of a parent item, allowing the user to customize the item by making choices or bundling extras with their order */
export interface ModifierGroup {
  /** A unique identifying string for the modifier group, provided by the restaurant */
  id: string;
  /** Free-form text field reserved for the restaurant’s use, e.g. for POS integrations */
  external_data?: string | null;
  title: MultiLanguageText;
  quantity_info?: QuantityConstraintRules;
  /** A list of menu entity objects representing available item options for the modifier group - cannot include any menu entities with a type of 'MODIFIER_GROUP' */
  modifier_options?: MenuEntity[] | null;
  /** Describes how this modifier group should be initially displayed - whether fully expanded (the default setting if this field is not provided), or collapsed */
  display_type?: "expanded" | "collapsed";
}
/** Miscellaneous configuration settings for the display of all of the store’s menus */
export interface DisplayOptions {
  /** Whether to allow the user to supply instructions for preparing menu items to the restaurant - applies store-wide */
  disable_item_instructions?: boolean;
}
/** Nutritional information for the item */
export interface Item_nutritional_info {
  calories?: NutritionalInfo;
  kilojoules?: NutritionalInfo;
}
/** Overrides the item price in a specified context */
export interface PriceRules_overrides {
  /** Type of the context in which to override */
  context_type?: "MENU" | "ITEM" | "MODIFIER_GROUP";
  /** Identifying string (id) for the specified context */
  context_value?: string;
  /** Price of the item in the lowest local currency denomination, e.g. cents */
  price?: number;
}
/** Overrides the quantity constraints in a specified context */
export interface QuantityConstraintRules_overrides {
  /** Type of the context in which to override */
  context_type?: "MENU" | "ITEM" | "MODIFIER_GROUP";
  /** Identifying string (id) for the specified context */
  context_value?: string;
  quantity?: QuantityConstraint;
}
/** Overrides an item’s suspension in a specified context */
export interface SuspensionRules_overrides {
  /** Type of the context in which to override */
  context_type?: "MENU" | "ITEM" | "MODIFIER_GROUP";
  /** Identifying string (id) for the specified context */
  context_value?: string;
  suspension?: Suspension;
}
/** Overrides the modifier groups associated with an item in a specified context */
export interface ModifierGroupsRules_overrides {
  /** Type of the context in which to override */
  context_type?: "MENU" | "ITEM" | "MODIFIER_GROUP";
  /** Identifying string (id) for the specified context */
  context_value?: string;
  /** A list of the identifying strings (ids) of all modifier groups associated with the item in this context */
  ids?: string[];
}

export interface WebhookEvent {
  event_type:
    | "store.provisioned"
    | "store.deprovisioned"
    | "store.menu_refresh_request"
    | "orders.notification"
    | "orders.cancel";
}

export interface StoreProvisionedWebhookEvent extends WebhookEvent {
  event_type: "store.provisioned";
  store_id: string;
  partner_store_id?: string;
  perform_refresh_menu?: boolean;
  resource_href: string;
  webhook_meta: {
    client_id: string;
    webhook_config_id: string;
    webhook_msg_timestamp: number;
    webhook_msg_uuid: string;
  };
}

export interface StoreDeprovisionedWebhookEvent
  extends Omit<StoreProvisionedWebhookEvent, "event_type"> {
  event_type: "store.deprovisioned";
}

export interface OrderNotificationWebhookEvent extends WebhookEvent {
  event_type: "orders.notification";
  event_id: string;
  event_time: number;
  meta: {
    resource_id: string;
    user_id: string;
    status: "pos";
  };
  resource_href: string;
}

export interface OrderCancelWebhookEvent extends WebhookEvent {
  event_type: "orders.cancel";
  event_id: string;
  event_time: number;
  meta: {
    resource_id: string;
    user_id: string;
    status: "pos";
  };
  resource_href: string;
}

export interface Region {
  time_zone: string;
}

export interface OrderNumberResult {
  orderNumber: string;
}
export interface updateStatusPayload {
  status: "PAUSED" | "ONLINE" | "";
  paused_until?: string;
  reason: string;
}

export interface ItemDetails {
  sections: string;
  itemId: string;
  secondLanguageName: string;
}

export interface StoreOrderNumberResults {
  host: string;
  region_id: string;
  shost: string;
}

interface PriceConfig {
  basePrice: number;
  baseIncreasePercentage?: number;
  vatPercentage?: number;
}

export interface MenuPublish {
  store_id: number;
  source: string;
}

export interface OutOfStock {
  store_id: number;
  host: string;
  entity_id: number;
  entity_name: string;
  action: "enable" | "disable";
}
export interface NutritionInfo {
  kilojoules: EnergyUnits;
  calories: EnergyUnits;
}

export interface EnergyUnits {
  unit: string;
  value: any;
}
