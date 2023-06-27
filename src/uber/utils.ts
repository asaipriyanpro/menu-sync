import {
  ServiceAvailability,
  FoodhubAddonCategoryMap,
  FoodhubAddon,
  QuantityConstraintRules,
  FHItem,
  TaxInfo,
  NutritionInfo,
} from "./type";

/**
 * Helper to serialise metadata shared between menu both services (foodhub + uber)
 */
export const serialise = (data: Record<string, any>) =>
  Buffer.from(JSON.stringify(data)).toString("base64");

/**
 * Helper function that returns a formatted id
 * this is useful for comparing menus and being able to resolve items and addons
 *
 * @examples
 * toId(123) => "123"
 * toId("123") => "123"
 * toId(123, "store") => "store:123",
 * toId("123", "store") => "store:123",
 */
export const toId = (id: string | number, prefix?: string) => {
  return `${prefix ? `${prefix}:` : ""}${id}`;
};

/**
 * Helper to return the I18nMessage structure
 */
export const i18nMessage = (message: string, lng: string = "en_us") => ({
  translations: { [lng]: message },
});

/**
 * Helper to return Availability structure
 */
export const availability = (
  day_of_week: ServiceAvailability["day_of_week"],
  start_time: string = "00:00",
  end_time: string = "23:59"
): ServiceAvailability => ({
  day_of_week,
  time_periods: [{ start_time, end_time }],
});

/**
 * Helper to return Modifier Structure structure
 */
export const modifierGroup = (ids: string[]) => ({
  ids,
  overrides: [],
});

/**
 * Helper to return PriceInfo structure
 */
export const priceInfo = (price: number, hikePercentage: number) => ({
  price: Math.round((price + (price * hikePercentage) / 100) * 100),
  overrides: [],
});

export const getQuantityFromAddon = (
  addon: FoodhubAddon
): QuantityConstraintRules | undefined => {
  return addon
    ? {
        quantity: {
          /**
           * If on our menu the trype us set to radio, we require atleast 1
           */
          min_permitted: addon && addon.type === "radio" ? 1 : 0,
          /**
           * If on our menu the type is set to multi, we allow for more than one selection,
           * otherwise any amount
           */
          max_permitted: addon && addon.type === "multi" ? undefined : 1,
          /**
           * When we have a required field, we have a default minimum of 1 required
           */
          default_quantity: addon && addon.type === "radio" ? 1 : 0,
        },
      }
    : undefined;
};

export const taxInfo = (item: FHItem): TaxInfo => ({});

/**
 * Helper unction that is able to resolve the next_move of the menu in order
 * to return a flat list of required modifiers for an item
 */
export const resolveNextMoves = (
  groupId: string,
  addonMap: FoodhubAddonCategoryMap
): string[] => {
  const ids = [];
  do {
    if (addonMap[groupId]?.category.next_move) {
      ids.push(addonMap[groupId].category.next_move);
    }
  } while ((groupId = addonMap[groupId]?.category.next_move));
  return ids;
};
export function transformNutritionInfo(
  nutrition: NutritionInfo,
  item: FHItem
): {
  caloriesSplit: number[];
  kilojoulesSplit: number[];
  number_of_servings: number[];
} {
  const splitArray = ["to", "-"];

  const parseValue = (value: string) => {
    return value
      ? value
          .split(new RegExp(splitArray.join("|")))
          .filter(Boolean)
          .map(Number)
      : [];
  };

  const caloriesSplit: number[] = parseValue(nutrition?.calories?.value);
  const kilojoulesSplit: number[] = parseValue(nutrition?.kilojoules?.value);
  const number_of_servings: number[] = parseValue(item.number_of_servings);

  return {
    caloriesSplit,
    kilojoulesSplit,
    number_of_servings,
  };
}
