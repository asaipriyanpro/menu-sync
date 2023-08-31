export interface FoodHubCategory {
  id: number;
  partner_id: string;
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
  tax_percentage: number;
  is_vat_included: string;
  is_schedule: number;
  region_tax_id: string | null;
  schedule: [];
  subcat: FoodHubSubCategory[];
}
export interface FoodHubSubCategory {
  id: number;
  partner_id: string;
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
  tax_percentage: number;
  is_vat_included: string;
  is_print_label: string;
  additional_charges: string;
  is_schedule: number;
  region_tax_id: string | null;
  is_image_approved: string;
  schedule: [];
  item: FoodHubItem[];
}
export interface FoodHubItem {
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
  offer?: "NONE" | "BOGOF" | "BOGOH";
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
  tax_percentage: number;
  is_vat_included: string;
  food_type: string;
  sections: null;
  half_and_half_status: number;
  half_and_half_charges: null;
  is_schedule: number;
  region_tax_id: null;
  is_image_approved: string;
  schedule: [];

  // New
  partner_id: string;
  suitable_diet: string;
  next_moves: string[];
  nutrition: string;
  number_of_servings: number;
}

export interface FoodhubAddonCategoryMapCategory {
  id: number;
  partner_id: string;
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
  minimum: number;
  maximum: number;
}

export interface FoodhubAddon {
  id: number;
  partner_id: string;
  host: string;
  item_addon_cat: number;
  name: string;
  type: "radio" | "multi";
  price: string;
  background_color: string;
  font_color: string;
  pos: number;
  next_move: string;
  offer?: "NONE" | "BOGOF" | "BOGOH";
  created_date: string;
  user: string;
  sys: string;
  show_online: number;
  show_on_receipt: number;
  second_language_name: string;
  updated_at: string;
  is_print_label: string;
  region_tax_id: string | null;
  tax_percentage: number;
  is_vat_included: string;
  //new
  suitable_diet: string;
  next_moves: string[];
  nutrition: string;
}

// export interface FoodhubAddonCategoryMap {
//   [id: string]: {
//     category: FoodhubAddonCategoryMapCategory
//     addon: FoodhubAddon[]
//   }
// }

export interface FoodHubMenu {
  categories: FoodHubCategory[];
  addons: FoodhubAddonCategoryMap;
}

export interface FoodhubAddonCategoryMap {
  category: FoodhubAddonCategoryMapCategory[];
  addon: FoodhubAddon[];
}

export interface FoodHubMenuV1 {
  categories: FoodHubCategory[];
  addons: FoodhubAddonCategoryMapV1;
}
export interface FoodhubAddonCategoryMapV1 {
  [id: string]: {
    category: FoodhubAddonCategoryMapCategory;
    addon: FoodhubAddon[];
  };
}

export interface CreateOrder {
  external_reference_id: string;
  friendly_id: string;
  aggregator_order_id?: string;
  placed_on: string;
  est_pick_up_time: string;
  est_delivery_time: string;
  source: string;
  customer: CreateOrderCustomer;
  delivery?: CreateOrderDelivery;

  /**
   * Type of Fulfillment required
   */
  fulfillment_type: "DELIVERY" | "COLLECTION";
  /**
   * List of items on the order
   */
  items: CreateOrderItem[];
  /**
   * Any special notes for the order
   */
  notes?: string;
  payment: CreateOrderPayment;

  /**
   * Indicates the total carry bags used for this order.
   */
  total_carry_bags?: number;

  /**
   * Utensils data
   */
  utensils?: boolean;
  pre_order_time?: string;
}

export interface CreateOrderCustomer {
  /**
   * First name of the customer
   */
  first_name: string;
  /**
   * Last name of the customer
   */
  last_name: string;

  /**
   * Phone number of the customer
   */
  phone?: string;
  /**
   * The phone code to access the phone number
   */
  phone_code?: string;
  /**
   * Email of the customer
   */
  email?: string;
}

export interface CreateOrderDelivery {
  /**
   * The address where the order will be delivered
   */
  address?: CreateOrderDeliveryAddress;
  /**
   * Delivery specific notes from the customer
   */
  notes?: string;
  /**
   * Delivery type for the order
   */
  type?: CreateOrderDeliveryType;
}

/**
 * The address where the order will be delivered
 */
export interface CreateOrderDeliveryAddress {
  /**
   * Full address
   */
  address1?: string;
  /**
   * Address Line 2
   */
  address2?: string;
  /**
   * Address Area
   */
  area?: string;

  /**
   * Address City
   */
  city?: string;

  /**
   * Latitude
   */
  lat?: string;
  /**
   * Longitude
   */
  long?: string;
  /**
   * Address Postcode
   */
  postcode?: string;
  /**
   * Type of the address
   */
  type: CreateOrderAddressType;
  /**
   * Flat/Building/Unit number
   */
  unit_number?: string;
  /**
   * Region or state
   */
  state?: string;
}

/**
 * Type of the address
 */
export enum CreateOrderAddressType {
  StreetAddress = "STREET_ADDRESS",
}

/**
 * Delivery type for the order
 */
export enum CreateOrderDeliveryType {
  DeliveryByCourier = "DELIVERY_BY_COURIER",
  DeliveryByRestaurant = "DELIVERY_BY_RESTAURANT",
}

export interface CreateOrderItem {
  /**
   * List of addons against the item
   */
  addons: CreateOrderItemAddon[];
  /**
   * Order Item
   */
  id: string;
  /**
   * The title of the item
   */
  name: string;
  /**
   * Any special notes specifically for the item
   */
  notes?: string;
  /**
   * Price of the item
   */
  price: number;
  /**
   * The total quantity requested for this item
   */
  quantity: number;
}

/**
 * Addons associated with an Order Item
 */
export interface CreateOrderItemAddon {
  /**
   * Addon identifier
   */
  id: string;
  /**
   * The title of the Addon
   */
  name: string;
  /**
   * Price of the Addon
   */
  price: number;
  /**
   * The total quantity requested for this addon
   */
  quantity: number;
}

export interface CreateOrderPayment {
  charges: OrderCharges;
  /**
   * Indicates payment status
   */
  payment_status: "PAID" | "UNPAID";
  /**
   * Indicates the mode of the payment
   */
  payment_type: "CARD" | "CASH" | "ONLINE";
  /**
   * The total excluding charges
   */
  subtotal: number;
  /**
   * The total amount for the order
   */
  total: number;
  /**
   * Discounts applied on order
   */
  discounts?: CreateOrderDiscount[];
}
export interface CreateOrderDiscount {
  /**
   * Discount applied to the order
   */
  discount_value: number;
  /**
   * Discount Type of the order
   */
  discount_type: "FIXED_AMOUNT" | "PERCENTAGE";
  /**
   * Discount Percentage on the order
   */
  discount_percentage?: string;
}

export interface OrderCharges {
  /**
   * Total charges applied to this order for carry bags
   */
  carry_bags_charge?: number;
  /**
   * Delivery Fee for delivering the order
   */
  delivery_fee?: number;
  /**
   * Service fee for processing the order
   */
  service_fee?: number;
  /**
   * Total tax applied to this order
   */
  tax: number;
  surcharge?: number;
  package_charge?: number;
  small_order_charge?: number;
  tip_for_restaurant?: number;
  driver_tips?: number;
  other_charge?: number;
}

export interface CartCharges {
  surcharge?: number;
  package_charge?: number;
  small_order_charge?: number;
  tip_for_restaurant?: number;
  driver_tips?: number;
  other_charge?: number;
}

export interface ValidPut {
  client_id: string;
  store_id: string;
  source: string;
  status: string;
}

export interface InvalidBody {
  client_id: string;
  store_id: string;
}

export interface ValidPut {
  client_id: string;
  store_id: string;
  source: string;
  status: string;
}

export interface InvalidBody {
  client_id: string;
  store_id: string;
}

export interface ItemDetails {
  sections: string;
  itemId: string;
  secondLanguageName: string;
}
