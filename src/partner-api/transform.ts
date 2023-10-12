import morphism, { Schema } from "morphism";
import {
  MenuEntity,
  MenuFulfillmentModes,
  MenuAvailability,
} from "./declarations";
import {
  FoodHubCategory,
  FoodHubSubCategory,
  FoodHubItem,
  FoodhubAddonCategoryMapV1,
  FoodHubMenuV1,
} from "./types";

import { checkFalsyValues, getOriginalPriceExludingVat } from "./utils";

/**
 * Helper unction that is able to resolve the next_move of the menu in order
 * to return a flat list of required modifiers for an item
 */
export const resolveNextMoves = (
  groupId: string,
  addonMap: FoodhubAddonCategoryMapV1
): string[] => {
  const ids = [];
  const nextMoveIds = [];

  do {
    try {
      if (addonMap[groupId]?.category?.next_move) {
        if (
          nextMoveIds.includes(addonMap[groupId].category.next_move.toString())
        ) {
          console.log("Category loop", nextMoveIds);
          break;
        }

        nextMoveIds.push(addonMap[groupId]?.category?.next_move);
        ids.push(
          checkFalsyValues(
            addonMap[addonMap[groupId].category.next_move].category.partner_id
          )
            ? `mod-group:${addonMap[groupId]?.category.next_move}`
            : String(
                addonMap[addonMap[groupId]?.category.next_move]?.category
                  .partner_id
              )
        );
      }
    } catch (err) {
      console.log(addonMap[groupId]?.category?.next_move, err);
    }
  } while (
    addonMap[groupId] &&
    (groupId = addonMap[groupId]?.category.next_move)
  );

  return ids;
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
    return internalIds.map((internalId) => `mod-group:${internalId}`);
  } else {
    return [];
  }
};

const getAvailability = ({
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
}: FoodHubCategory | FoodHubSubCategory | FoodHubItem): MenuAvailability => {
  const result: MenuAvailability = [];
  monday && result.push("MO");
  tuesday && result.push("TU");
  wednesday && result.push("WE");
  thursday && result.push("TH");
  friday && result.push("FR");
  saturday && result.push("SA");
  sunday && result.push("SU");
  return result;
};

export const toId = (prefix: string, id: string | number) => {
  return Buffer.from(`${prefix}:${id}`).toString("base64");
};

export const getFufillmentModes = (
  collection: boolean | number,
  delivery: boolean | number
): MenuFulfillmentModes => {
  const r = [];
  collection ? r.push("COLLECTION") : void 0;
  delivery ? r.push("DELIVERY") : void 0;
  return r as any;
};

const transform: Schema<MenuEntity, FoodHubMenuV1> = {
  categories: ({ categories }) =>
    categories.map((category) => {
      return {
        id: checkFalsyValues(category.partner_id)
          ? `category:${category.id}`
          : String(category.partner_id),
        name: category.name,
        availability: getAvailability(category),
        fulfillment_modes: getFufillmentModes(
          category.collection,
          category.delivery
        ),
        show_online: !!category.show_online,
        tax_percentage:
          category.tax_percentage !== null
            ? Number(category.tax_percentage)
            : undefined,
        is_tax_included: category.is_vat_included === "1",
        subcategories: category.subcat.map((subcat) =>
          checkFalsyValues(subcat.partner_id)
            ? `subcat:${subcat.id}`
            : String(subcat.partner_id)
        ),
      };
    }),

  /**
   *
   */
  subcategories: ({ categories }) =>
    categories
      .map((category) =>
        category.subcat.map((subcat) => {
          return {
            id: checkFalsyValues(subcat.partner_id)
              ? `subcat:${subcat.id}`
              : String(subcat.partner_id),
            name: subcat.name,
            description: subcat.description,
            availability: getAvailability(subcat),
            fulfillment_modes: getFufillmentModes(
              subcat.collection,
              subcat.delivery
            ),
            show_online: !!subcat.show_online,
            tax_percentage:
              subcat.tax_percentage !== null
                ? Number(subcat.tax_percentage)
                : undefined,
            is_tax_included: subcat.is_vat_included === "1",
            image: subcat.image || undefined,
            items: subcat.item.map((item) =>
              checkFalsyValues(item.partner_id)
                ? `item:${item.id}`
                : String(item.partner_id)
            ),
          };
        })
      )
      .flat(),

  items: ({ categories, addons }) =>
    categories
      .map((cat) =>
        cat.subcat
          .map((subcat) =>
            subcat.item
              .map((item) => ({
                id: checkFalsyValues(item.partner_id)
                  ? `item:${item.id}`
                  : String(item.partner_id),
                name: item.name,
                description: item.description,
                availability: getAvailability(item),
                fulfillment_modes: getFufillmentModes(
                  item.collection,
                  item.delivery
                ),
                offer: item.offer === "NONE" ? undefined : item.offer,
                dietary_labels: item.suitable_diet
                  ? JSON.parse(item.suitable_diet)
                  : undefined,
                nutrition: item.nutrition
                  ? JSON.parse(item.nutrition)
                  : undefined,
                show_online: Boolean(item.show_online),
                tax_percentage:
                  item.tax_percentage !== null
                    ? Number(item.tax_percentage)
                    : undefined,
                is_tax_included: item.is_vat_included === "1",
                image: item.image || undefined, // remove when empty
                price:
                  item.is_vat_included !== "1" && item.tax_percentage !== null
                    ? getOriginalPriceExludingVat(
                        item.price * 100,
                        item.tax_percentage / 100
                      )
                    : Number((item.price * 100).toFixed(2)), //remove vat value to get the original price.
                // Map all groups to modifier group-id
                modifier_groups:
                  item.item_addon_cat != "0"
                    ? [
                        checkFalsyValues(
                          addons[item.item_addon_cat]?.category.partner_id
                        )
                          ? `mod-group:${item.item_addon_cat}`
                          : String(
                              addons[item.item_addon_cat]?.category.partner_id
                            ),

                        ...resolveNextMoves(item.item_addon_cat, addons).map(
                          (id) => String(id)
                        ),
                      ]
                    : [],
              }))
              .flat()
          )
          .flat()
      )
      .flat(),

  modifier_groups: ({ addons }) =>
    (addons &&
      Object.keys(addons).map((categoryId) => {
        const catAddons = addons[categoryId].addon;
        const minimum = addons[categoryId].category.minimum;
        const maximum = addons[categoryId].category.maximum;
        return {
          id: checkFalsyValues(addons[categoryId].category.partner_id)
            ? `mod-group:${categoryId}`
            : String(addons[categoryId].category.partner_id),
          name: addons[categoryId].category.name,
          description: addons[categoryId].category.description,
          min_permitted:
            catAddons.length > 0 && catAddons[0].type.toLowerCase() === "radio"
              ? 1
              : 0,
          max_permitted:
            catAddons.length > 0 && catAddons[0].type.toLowerCase() === "multi"
              ? 0
              : undefined,
          modifiers:
            addons[categoryId].addon.map((item) =>
              checkFalsyValues(item.partner_id)
                ? `mod:${item.id}`
                : String(item.partner_id)
            ) || [],
        };
      })) ||
    [],
  modifiers: ({ addons }) =>
    (addons &&
      Object.keys(addons)
        .map((categoryId) => {
          const { addon } = addons[categoryId];
          return addon
            .map((don) => ({
              id: checkFalsyValues(don.partner_id)
                ? `mod:${don.id}`
                : String(don.partner_id),
              name: don.name,
              price:
                don.tax_percentage && don.tax_percentage > 0
                  ? getOriginalPriceExludingVat(
                      parseFloat(don.price) * 100,
                      don.tax_percentage / 100
                    )
                  : Number((parseFloat(don.price) * 100).toFixed(2)),
              offer: don.offer,
              show_online: Boolean(don.show_online),
              tax_percentage:
                don.tax_percentage !== null
                  ? Number(don.tax_percentage)
                  : undefined,
              is_tax_included: !(don.tax_percentage && don.tax_percentage > 0),
              min_permitted: don.type.toLowerCase() === "radio" ? 1 : 0,
              max_permitted: don.type.toLowerCase() === "multi" ? 0 : undefined,
              dietary_labels: don.suitable_diet
                ? JSON.parse(don.suitable_diet)
                : undefined,
              nutrition: don.nutrition ? JSON.parse(don.nutrition) : undefined,
              modifier_groups: getChildGroupsForAddon(don, addons),
            }))
            .flat();
        })
        .flat()) ||
    [],
};

/**
 *
 */
export const transformLegacyV1MenuToPartnerMenu = morphism(transform);
