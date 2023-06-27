import { AddonCategory } from "./preflight-check";
import {
  UrbanPiperItem,
  UrbanPiperOption,
  UrbanPiperOptionGroup,
  UrbanPiperPayload,
} from "./types";
import { calculatePrice, suitableDietToUPFoodType } from "./utils";

/**
 * UP seem to have a 'truthy' bug in their update code
 * (If we send sort_order=0 or try to update from sort_order=0 that update is
 * ignored and item/addon is left with previous value.)
 * Offset is simply used to avoid sending zero.
 */
const SORT_ORDER_OFFSET = 1;

export const transformMenuToUrbanPiperPayload = (
  categories: any[],
  addons: any,
  baseIncreasePercentage: number
): UrbanPiperPayload => {
  return {
    flush_categories: true,
    flush_items: true,
    flush_option_groups: true,
    flush_options: true,
    flush_taxes: true,
    flush_charges: true,
    categories: getCategories(categories),
    items: getItems(categories, baseIncreasePercentage),
    option_groups: getOptionGroups(categories, addons),
    options: getOptions(addons, baseIncreasePercentage),
    charges: [],
    taxes: [],
  };
};

const getChildGroupsForAddon = (addon: any, addons: any): string[] => {
  if (addon.next_move && addon.next_move !== "0") {
    /**
     * The addon has nested (child) groups
     */
    const internalIds = [
      addon.next_move,
      ...resolveNextMoves(addon.next_move, addons),
    ];
    console.log(internalIds);
    return internalIds.map(
      (internalId) => `modifier:${addon.id}##mod-group:${internalId}`
    );
  } else {
    return [];
  }
};

const getOptions = (
  addons: any,
  baseIncreasePercentage?: number
): UrbanPiperOption[] => {
  return Object.values(addons)
    .map((addonMap: any) =>
      addonMap.addon.map(
        (addon: any): UrbanPiperOption => ({
          ref_id: `modifier:${addon.id}`,
          title: addon.name,
          available: addon.show_online === 1,
          description: "",
          food_type: suitableDietToUPFoodType(addon.suitable_diet),
          price: calculatePrice({
            basePrice: parseFloat(addon.price),
            baseIncreasePercentage,
            vatPercentage:
              addon.is_vat_included !== "1" ? addon.tax_percentage : 0,
          }),
          opt_grp_ref_ids: [`mod-group:${addon.item_addon_cat}`],
          nested_opt_grps: getChildGroupsForAddon(addon, addons),
          sold_at_store: true,
          sort_order: SORT_ORDER_OFFSET + (addon.pos || 0),
        })
      )
    )
    .flat();
};

const addToMappedList = (
  map: { [key: string]: string[] },
  key: string,
  newItem: string
): void => {
  const existingList = map[key];

  if (existingList) {
    if (!existingList.includes(newItem)) {
      existingList.push(newItem);
    }
  } else {
    map[key] = [newItem];
  }
};

const resolveNextMoves = (groupId: string, addonMap: any): string[] => {
  const ids = [];
  do {
    if (addonMap[groupId]?.category.next_move) {
      ids.push(addonMap[groupId].category.next_move);
    }
  } while ((groupId = addonMap[groupId]?.category.next_move));

  return ids;
};

const getOptionGroups = (
  categories: any[],
  addons: any
): UrbanPiperOptionGroup[] => {
  /**
   * Create map of addon-cat => items
   */
  const addonCatToItems: { [key: string]: string[] } = {};
  const addonCatSequenceForItems: { [key: string]: string[] } = {};
  /**
   * Populate the map
   */
  categories.map((category) =>
    category.subcat.map((subcat: any) =>
      subcat.item
        .filter(
          (item: any) => item.item_addon_cat && item.item_addon_cat != "0"
        )
        .map((item: any) => {
          addons[item.item_addon_cat].category.pos = 1;
          return item;
        })
        .forEach((itemWithAddonCat: any) => {
          const addonCatSequenceForItem = [
            itemWithAddonCat.item_addon_cat,
            ...resolveNextMoves(itemWithAddonCat.item_addon_cat, addons),
          ];
          addonCatSequenceForItems[`item:${itemWithAddonCat.id}`] =
            addonCatSequenceForItem.map((x) => `mod-group:${x}`);

          addonCatSequenceForItem.forEach((addonCatId) =>
            addToMappedList(addonCatToItems, addonCatId, itemWithAddonCat.id)
          );
        })
    )
  );

  return Object.values(addons).map(({ category, addon }: any) => {
    return {
      ref_id: `mod-group:${category.id}`,
      title: category.name,
      description: category.description,
      sort_order: SORT_ORDER_OFFSET + category.pos,
      ref_title: category.name,
      active: true,
      item_ref_ids:
        category.id in addonCatToItems
          ? addonCatToItems[category.id].map((itemId: any) => `item:${itemId}`)
          : [],
      min_selectable: addon.length > 0 && addon[0].type === "radio" ? 1 : 0,
      max_selectable: addon.length > 0 && addon[0].type === "multi" ? -1 : 1,
      clear_item_ref_ids: false,
    };
  });
};

const getCategories = (categories: any[]) =>
  categories
    .map((cat: any) => {
      return [
        {
          ref_id: `cat:${cat.id}`,
          name: cat.name,
          description: "",
          img_url: cat.image,
          active: cat.show_online > 0,
          sort_order: cat.pos ? cat.pos : SORT_ORDER_OFFSET,
        },
        ...cat.subcat.map((subcat: any) => ({
          ref_id: `subcat:${subcat.id}`,
          name: subcat.name,
          description: subcat.description,
          img_url: cat.image,
          active: subcat.show_online > 0,
          sort_order: subcat.pos
            ? cat.pos * 100 + subcat.pos
            : SORT_ORDER_OFFSET,
          parent_ref_id: `cat:${cat.id}`,
        })),
      ];
    })
    .flat();

const getItems = (categories: any[], baseIncreasePercentage?: number) =>
  categories
    .map((cat: any) =>
      cat.subcat.map((subcat: any) =>
        subcat.item.map(
          (item: any): UrbanPiperItem => ({
            ref_id: `item:${item.id}`,
            title: item.name,
            description: item.description,
            category_ref_ids: [`subcat:${item.subcat}`],
            price: calculatePrice({
              basePrice: parseFloat(item.price),
              baseIncreasePercentage,
              vatPercentage:
                item.is_vat_included !== "1" ? item.tax_percentage : 0,
            }),
            sort_order: SORT_ORDER_OFFSET + (item.pos || 0),
            sold_at_store: true,
            translations: [],
            available: item.show_online === 1,
            current_stock: -1,
            food_type: suitableDietToUPFoodType(item.suitable_diet),
            img_url: item.image,
            clear_option_groups: false,
            fulfillment_modes: [
              ...(item.collection ? ["pickup"] : []),
              ...(item.delivery ? ["delivery"] : []),
            ],
          })
        )
      )
    )
    .flat()
    .flat();
