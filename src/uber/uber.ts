import {
  MenuConfiguration,
  FoodHubMenu,
  Item,
  Category,
  ServiceAvailability,
  Menu,
  ModifierGroup,
} from "./type";
import {
  toId,
  serialise,
  modifierGroup,
  resolveNextMoves,
  priceInfo,
  getQuantityFromAddon,
  i18nMessage,
  taxInfo,
  transformNutritionInfo,
} from "./utils";

export const basicTransformer = (
  menu: FoodHubMenu,
  isV3Menu: boolean
): MenuConfiguration => {
  return {
    menu_type:
      menu.menuType === "delivery"
        ? "MENU_TYPE_FULFILLMENT_DELIVERY"
        : "MENU_TYPE_FULFILLMENT_PICK_UP",
    menus: getMenu(menu),
    categories: getCategories(menu),
    items: isV3Menu ? getItemsV3(menu) : getItemsV1(menu),
    modifier_groups: isV3Menu
      ? getModifierGroupsV3(menu)
      : getModifierGroupsV1(menu),
    display_options: { disable_item_instructions: true },
  };
};

const getMenu = (menu: FoodHubMenu): Menu[] => {
  const { categories, store, storeAvailability, menuType } = menu;
  return [
    {
      id: toId(store.id, "store"),
      title: i18nMessage(store.name),
      subtitle: i18nMessage(store.description),
      service_availability: storeAvailability
        // Filter by collection | delivery dates
        .filter((x) => x.service_type === menuType)
        // Combine the start/end per day times into the correct shape required for uber
        .reduce<ServiceAvailability[]>((state, row) => {
          const idx = state.findIndex((d) => d.day_of_week === row.day);
          if (idx === -1) {
            state.push({
              day_of_week: row.day as any,
              time_periods: [
                { start_time: row.open_at, end_time: row.close_at },
              ],
            });
          } else {
            state[idx].time_periods?.push({
              start_time: row.open_at,
              end_time: row.close_at,
            });
          }
          return state;
        }, []),

      /**
       * Connect the categories applicable to this menu
       */
      category_ids: categories
        .map((category) =>
          category.subcat.map((subcat) => toId(subcat.id, "fh_category"))
        )
        .flat(),
    },
  ];
};

const getCategories = (menu: FoodHubMenu): Category[] => {
  return menu.categories
    .map((category) =>
      category.subcat.map<Category>((subcat) => ({
        id: toId(subcat.id, "fh_category"),
        title: i18nMessage(subcat.name || category.name),
        subtitle: i18nMessage(subcat.description),
        entities: subcat.item.map((item) => ({
          id: toId(item.id, "fh_item"),
          type: "ITEM",
        })),
      }))
    )
    .flat();
};
/**
 * Foodhub version 1 menu structure convert to uber
 */
const getItemsV1 = (menu: FoodHubMenu): Item[] => {
  const { categories, addonsV1, priceHikePercent } = menu;
  const items = categories
    .map((category) => category.subcat.map((subcat) => subcat.item).flat())
    .flat();

  return [
    /**
     * First we confiogure all the "category.subcat.item[]" as items on the uber menu.
     */
    items.map<Item>((item) => {
      const nutrition = item?.nutrition
        ? JSON.parse(item?.nutrition)
        : undefined;

      const { caloriesSplit, kilojoulesSplit, number_of_servings } =
        transformNutritionInfo(nutrition, item);
      return {
        id: toId(item.id, "fh_item"),
        title: i18nMessage(item.name || "MISSING"),
        external_data: serialise({ type: "item", id: item.id }),
        description: i18nMessage(item.description),
        image_url: item.aws_image || item.image,
        modifier_group_ids: modifierGroup(
          Number(item.item_addon_cat) > 0
            ? [
                // first move
                toId(item.item_addon_cat, "fh_addon-cat"),
                // get each of the enxt move in order
                ...resolveNextMoves(item.item_addon_cat, addonsV1).map((id) =>
                  toId(id, "fh_addon-cat")
                ),
              ]
            : []
        ),
        price_info: priceInfo(+item.price, priceHikePercent),
        tax_info: taxInfo(item),
        nutritional_info: {
          allergens: item.allergies ? item.allergies : [],
          ...(caloriesSplit.length && {
            calories: {
              lower_range: caloriesSplit[0],
              upper_range: caloriesSplit[1]
                ? caloriesSplit[1]
                : caloriesSplit[0],
              display_type: caloriesSplit[1] ? "multiple_items" : "single_item",
            },
          }),
          ...(kilojoulesSplit.length && {
            kilojoules: {
              lower_range: kilojoulesSplit[0],
              upper_range: kilojoulesSplit[1]
                ? kilojoulesSplit[1]
                : kilojoulesSplit[0],
              display_type: kilojoulesSplit[1]
                ? "multiple_items"
                : "single_item",
            },
          }),
          ...(number_of_servings.length && {
            number_of_servings_interval: {
              lower: number_of_servings[0] * 100000,
              upper: number_of_servings[1]
                ? number_of_servings[1] * 100000
                : number_of_servings[0] * 100000,
            },
          }),
        },
      };
    }),

    /**
     * Now we we map each addon that is available accross the menu as items as well.
     * These "addon" products will be grouped together in the "modifier_groups" section, and
     * the item will connect to the groups that are applicable
     */
    Object.values(addonsV1)
      .map(({ addon }) =>
        addon
          .map<Item>((addon, idx) => {
            return {
              id: toId(addon.id, "fh_addon"),
              price_info: priceInfo(+addon.price, priceHikePercent),
              title: i18nMessage(addon.name),
              external_data: serialise({ type: "addon", id: addon.id }),
              tax_info: {
                /**
                 * @todo The tax rate for the item, included in the price - must be between 0 and 100 inclusive
                 */
                // tax_rate
                /**
                 * @todo Value-added tax rate for the item, additional to the price - must be between 0 and 100 inclusive
                 */
                // vat_rate_percentage
              },
              modifier_group_ids: {
                ids: addon.next_move
                  ? [
                      addon.next_move,
                      ...resolveNextMoves(addon.next_move, addonsV1),
                    ].map((id) => toId(id, "fh_addon-cat"))
                  : [],
              },
            };
          })
          .flat()
      )
      .flat(),
  ].flat();
};
const getModifierGroupsV1 = (menu: FoodHubMenu): ModifierGroup[] => {
  return Object.values(menu.addonsV1).map(({ category, addon }, idx) => ({
    id: toId(category.id, "fh_addon-cat"),
    title: i18nMessage(category.name),
    display_type: "expanded",
    quantity_info: getQuantityFromAddon(addon[0]),
    // Connect the options for this addon group, i.e the available addons
    // from the category
    modifier_options: addon.map(({ id }) => ({
      id: toId(id, "fh_addon"),
      type: "ITEM",
    })),
  }));
};
/**
 * Foodhub version 3 menu structure convert to uber
 */
const getItemsV3 = (menu: FoodHubMenu): Item[] => {
  const { categories, addonsV3, priceHikePercent } = menu;
  const items = categories
    .map((category) => category.subcat.map((subcat) => subcat.item).flat())
    .flat();

  return [
    /**
     * First we confiogure all the "category.subcat.item[]" as items on the uber menu.
     */
    items.map<Item>((item) => {
      const nutrition = item?.nutrition
        ? JSON.parse(item?.nutrition)
        : undefined;

      const { caloriesSplit, kilojoulesSplit, number_of_servings } =
        transformNutritionInfo(nutrition, item);

      return {
        id: toId(item.id, "fh_item"),
        title: i18nMessage(item.name || "MISSING"),
        external_data: serialise({ type: "item", id: item.id }),
        description: i18nMessage(item.description),
        image_url: item.aws_image || item.image,
        modifier_group_ids: modifierGroup(
          item.next_moves?.map((id) => toId(id, "fh_addon-cat"))
        ),
        price_info: priceInfo(+item.price, priceHikePercent),
        tax_info: taxInfo(item),
        nutritional_info: {
          allergens: item.allergies ? item.allergies : [],
          ...(caloriesSplit.length && {
            calories: {
              lower_range: caloriesSplit[0],
              upper_range: caloriesSplit[1]
                ? caloriesSplit[1]
                : caloriesSplit[0],
              display_type: caloriesSplit[1] ? "multiple_items" : "single_item",
            },
          }),
          ...(kilojoulesSplit.length && {
            kilojoules: {
              lower_range: kilojoulesSplit[0],
              upper_range: kilojoulesSplit[1]
                ? kilojoulesSplit[1]
                : kilojoulesSplit[0],
              display_type: kilojoulesSplit[1]
                ? "multiple_items"
                : "single_item",
            },
          }),
          ...(number_of_servings.length && {
            number_of_servings_interval: {
              lower: number_of_servings[0] * 100000,
              upper: number_of_servings[1]
                ? number_of_servings[1] * 100000
                : number_of_servings[0] * 100000,
            },
          }),
        },
      };
    }),

    /**
     * Now we we map each addon that is available accross the menu as items as well.
     * These "addon" products will be grouped together in the "modifier_groups" section, and
     * the item will connect to the groups that are applicable
     */
    addonsV3.addons.map<Item>((addon) => {
      return {
        id: toId(addon.id, "fh_addon"),
        price_info: priceInfo(+addon.price, priceHikePercent),
        title: i18nMessage(addon.name),
        external_data: serialise({ type: "addon", id: addon.id }),
        tax_info: {
          /**
           * @todo The tax rate for the item, included in the price - must be between 0 and 100 inclusive
           */
          // tax_rate
          /**
           * @todo Value-added tax rate for the item, additional to the price - must be between 0 and 100 inclusive
           */
          // vat_rate_percentage
        },
        modifier_group_ids: {
          ids: addon.next_moves.map((id) => toId(id, "fh_addon-cat")),
        },
      };
    }),
  ].flat();
};
const getModifierGroupsV3 = (menu: FoodHubMenu): ModifierGroup[] => {
  const { categories, addons } = menu.addonsV3;
  console.log();
  return categories.map((category) => ({
    id: toId(category.id, "fh_addon-cat"),
    title: i18nMessage(category.name),
    display_type: "expanded",
    quantity_info: getQuantityFromAddon(
      addons.find((ad) => ad.id == +category.next_moves[0])
    ),
    // Connect the options for this addon group, i.e the available addons
    // from the category
    modifier_options: category.next_moves.map((id) => ({
      id: toId(id, "fh_addon"),
      type: "ITEM",
    })),
  }));
};
