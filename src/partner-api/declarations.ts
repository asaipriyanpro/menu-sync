/**
 * Authorization Context
 */
export interface AuthorizerContext {
  /**
   * Client Store ID, also known as config id
   */
  clientStoreId: number;

  /**
   * List of comma separated scopes
   */
  scopes: string;
  /**
   * Product Name from configuration
   */
  productName: string;
  /**
   * Allowed source
   */
  allowedOrderSources: string;
  /**
   * If @enableUnMaskedPhoneNumbers is true, provide customers orginal phone number to partners
   */
  enableUnMaskedPhoneNumbers: string;
}

/**
 * Webhook Event Types
 */
export type WebhookEventType =
  | Pick<
      typeof OrderStatus,
      | "ORDER_PLACED"
      | "ORDER_ACCEPTED"
      | "ORDER_READY"
      | "ORDER_CANCELLED"
      | "ORDER_FULFILLED"
    >
  | "MENU_UPDATED";

export interface WebhookEventPayload {
  event_id: string;
  event_type: WebhookEventType;
  event_time: string;
  client_id: string;
  store_id: string;
  resource_href?: string;
}
export interface WebhookEvent {
  url: string;
  data: WebhookEventPayload | string;
  headers: { [x: string]: string };
}

/**
 * Identifier used to signify the current status of the order
 */
export enum OrderStatus {
  ORDER_NEW = 0,
  ORDER_PLACED = 1,
  ORDER_ACCEPTED = 2,
  ORDER_PREPARING = 2.5,
  ORDER_READY = 3,
  ORDER_FULFILLED = 3.5,
  ORDER_HIDDEN = 4,
  ORDER_CANCELLED = 4.1,
  ORDER_DELETED = 5,
}

/**
 * Type of fulfillment required for this order
 */
export enum FulfillmentType {
  COLLECTION = "COLLECTION",
  DELIVERY = "DELIVERY",
  WAITING = "WAITING",
  RESTAURANT = "RESTAURANT",
  UNDEFINED = "UNDEFINED",
}

export interface OrderCancelResponse {
  message: string;
}

export interface OrderHeaderEntity {
  /**
   * A list of charges that have been applied to this order
   */
  charges: OrderCharges;
  /**
   * Customer information for this particular order
   */
  customer: OrderCustomer;
  /**
   * Information required in order to fulfill a delivery based order
   */
  delivery_info?: OrderDeliveryInformation;
  /**
   * A List of discounts that were applied to the order
   */
  discounts: OrderDiscounts;
  /**
   * Type of fulfillment required for this order
   */
  fulfillment_type: FulfillmentType;
  /**
   * Status of the Payment for this order
   */
  payment_status: string;
  /**
   * Type of the payment for this order
   */
  payment_type: string;
  /**
   * Identifier that uniquely identifies an order
   */
  id: string;
  /**
   * This is the original source of the order
   */
  source: string;
  /**
   * The total excluding charges
   */
  notes: string;
  /**
   * A textual representation of why the order was cancelled
   */
  order_cancellation_reason?: string;
  /**
   * Order cancel reason
   */
  cancel_reason_id?: number;
  /**
   * The date/time when the order was placed
   */
  placed_on: Date;
  /**
   * Identifier used to signify the current status of the order
   */
  status: keyof typeof OrderStatus;
  /**
   * Total number of carry bags used for this order
   */
  total_carry_bags?: number;
  /**
   * The total excluding charges
   */
  subtotal: number;
  /**
   * The total amount for the order
   */
  total: number;
  version: number;
  friendly_id?: string;
  /**
   * Each order to have reference id
   */
  external_reference_id: string;

  /**
   * Utensils details
   */
  utensils?: boolean;

  /**
   * Pre order time
   */
  pre_order_time?: Date;

  /**
   * Estimate pick time for collection order
   */
  est_pickup?: Date;
}

export interface OrderEntity extends OrderHeaderEntity {
  /**
   * List of items on the order
   */
  items: OrderItem[];
}

/**
 * A list of charges that have been applied to this order
 */
export interface OrderCharges {
  /**
   * Total charges applied ot this order for carry bags
   */
  carry_bags?: number;
  /**
   * Delivery Fee for processing the order
   */
  delivery_fee: number;
  /**
   * Driver tips for the order
   */
  driver_tips?: number;
  /**
   * Service fee for processing the order
   */
  service_fee: number;
  /**
   * Total vat applied to this order
   */
  vat?: number;
  /**
   * Total vat applied to this order
   */
  tax: number;
}

/**
 * Customer information for this particular order
 */
export interface OrderCustomer {
  /**
   * Customers email address (proxy)
   */
  email?: string;
  /**
   * Customers First Name
   */
  first_name?: string;
  /**
   * Customers Last Name
   */
  last_name?: string;
  /**
   * Customers phone number (proxy)
   */
  phone?: string;
  /**
   * Customer's phone pin
   */
  phone_pin?: string;
}

/**
 * Information required in order to fulfill a delivery based order
 */
export interface OrderDeliveryInformation {
  /**
   * The address where the items will be delivered
   */
  address: DeliveryAddress;
  driver?: Driver;
  est_dropoff?: Date;
  notes?: string;
  type?: string;
}

/**
 * The address where the items will be delivered
 */
export interface DeliveryAddress {
  /**
   * Address Line 1
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
   * Flat number (if applicable)
   */
  flat_no?: string;
  /**
   * House number (if applicable)
   */
  house_no?: string;
  /**
   * Latitude
   */
  lat?: string;
  /**
   * Longitude
   */
  lon?: string;
  /**
   * Address Line 1
   */
  postcode?: string;
}

export interface Driver {
  display_name: string;
  id: string;
  lat?: string;
  lon?: string;
  photo?: string;
}

/**
 * A List of discounts that were applied to the order
 */
export interface OrderDiscounts {
  /**
   * Coupon Code applied to the order
   */
  coupon?: string;
  coupon_type?: string;
  coupon_value?: number;
  discount_percentage?: number;
  discount_code?: string;
  online_discount_value?: number;
  collection_discount_value?: number;
  points_used?: number;
  redeem_amount?: number;
  points_gained?: number;
  points_remaining?: number;
}

/**
 * List of items on the order
 */
export interface OrderItem {
  /**
   * List of addons against the item
   */
  addons: OrderAddon[];
  /**
   * Order Item
   */
  id: string;
  /**
   * The title if the item
   */
  name: string;
  /**
   * Any special notes specifically for the item
   */
  notes: string;
  /**
   * Price of the item
   */
  price: number;
  /**
   * The total quantity requested for this item
   */
  quantity: number;
  /**
   * Split vat value from price.
   */
  vat_split?: VatSplit;
  /**
   * Category name of the item.
   */
  category_name?: string;
}

export interface VAT {
  amount: number;
  label: string;
  percentage: number;
  value: number;
}

export interface VatSplit {
  label: string;
  value: VAT[];
}

export interface OrderAddon {
  id: string;
  name: string;
  price: number;
}

/**
 *
 */
export interface StoreEntity {
  id: string;
  host: string;
  name: string;
  description: string;
  logo: string;
  menu_url: string;
  address: StoreAddress;
  website_url: string;
}
/**
 *
 */
export interface StoreAddress {
  address1: string;
  address2: string;
  area: string;
  city: string;
  postcode: string;
}

export interface MenuAvailability
  extends Array<"MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU"> {}

export interface MenuDietaryLabels
  extends Array<"VEGAN" | "VEGETARIAN" | "GLUTEN_FREE"> {}
export interface MenuFulfillmentModes extends Array<string> {
  [index: number]: "COLLECTION" | "DELIVERY";
}
export interface NutritionInfo {
  calories: NutritionType;
  kilojoules: NutritionType;
  saturated_fat: NutritionType;
  carbohydrates: NutritionType;
  sugar: NutritionType;
  protein: NutritionType;
  salt: NutritionType;
  allergens?: string[];
  additive?: string[];
  dietary_restriction?: string;
  spiciness?: string;
}
export interface NutritionType {
  value: number;
  unit: string;
}

export interface Schedule {
  start_time: string;
  end_time: string;
}
/**
 *
 */
export interface MenuEntity {
  categories: MenuCategory[];
  subcategories: MenuSubCategory[];
  items: MenuItem[];
  modifiers: MenuModifier[];
  modifier_groups: MenuModifierGroup[];
}

export interface MenuCategory {
  id: string;
  name: string;
  availability: MenuAvailability;
  name_localized?: string;
  schedule?: Schedule;
  fulfillment_modes: MenuFulfillmentModes;
  show_online: boolean;
  tax_percentage?: number;
  is_tax_included: boolean;
  subcategories: string[];
}
export interface MenuSubCategory {
  id: string;
  name: string;
  description: string;
  name_localized?: string;
  schedule?: Schedule;
  availability: MenuAvailability;
  fulfillment_modes: MenuFulfillmentModes;
  show_online: boolean;
  tax_percentage?: number;
  is_tax_included: boolean;
  image?: string | null;
  items: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  availability: MenuAvailability;
  name_localized?: string;
  schedule?: Schedule;
  fulfillment_modes: MenuFulfillmentModes;
  dietary_labels?: MenuDietaryLabels;
  nutrition_info?: NutritionInfo;
  offer?: "BOGOF" | "BOGOH" | "NONE";
  image?: string | null;
  show_online: boolean;
  tax_percentage?: number;
  is_tax_included: boolean;
  price: number;
  modifier_groups: string[];
  number_of_servings?: number;
  contains_alcohol?: boolean;
  contains_tobacco?: boolean;
}

export interface MenuModifierGroup {
  id: string;
  name: string;
  description: string;
  name_localized?: string;
  min_permitted?: number;
  max_permitted?: number;
  modifiers: string[];
}

export interface MenuModifier {
  id: string;
  name: string;
  price: number;
  name_localized?: string;
  offer?: "BOGOF" | "BOGOH" | "NONE";
  dietary_labels?: MenuDietaryLabels;
  nutrition_info?: NutritionInfo;
  show_online: boolean;
  tax_percentage?: number;
  is_tax_included: boolean;
  min_permitted?: number;
  max_permitted?: number;
  contains_alcohol?: boolean;
  contains_tobacco?: boolean;
  modifier_groups?: string[];
}

/**
 * from and until should be in 'HH:MM' format
 */
export interface OpeningPeriod {
  from: string;
  until: string;
}

export type WeekOpenings = { [key: string]: OpeningPeriod[] };

export interface OpenHoursEntity {
  COLLECTION?: WeekOpenings;
  DELIVERY?: WeekOpenings;
}

export interface ScheduleDetails {
  table: "category_scheduler" | "subcat_scheduler" | "item_scheduler";
  condition: "category_id" | "subcat_id" | "item_id";
  stateField: "category" | "subcat" | "item";
  menuField: "categories" | "subcategories" | "items";
}

export interface ScheduleEntityInterface {
  category: ScheduleDetails;
  subcat: ScheduleDetails;
  item: ScheduleDetails;
}
