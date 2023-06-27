import morphism, { Schema } from "morphism";
import { MenuEntity, MenuFulfillmentModes } from "./declarations";
import {
  FoodHubMenu,
  FoodHubCategory,
  FoodHubSubCategory,
  FoodHubItem,
} from "./types";

import { MenuAvailability } from "./declarations";
import { getOriginalPriceExludingVat } from "./utils";

/**
 * Helper unction that is able to resolve the next_move of the menu in order
 * to return a flat list of required modifiers for an item
 */
// export const resolveNextMoves = (
//   groupId: string,
//   addonMap: FoodhubAddonCategoryMap
// ): string[] => {
//   const ids = []
//   do {
//     if (addonMap[groupId]?.category?.next_move) {
//       ids.push(
//         addonMap[addonMap[groupId].category.next_move].category.partner_id ||
//           addonMap[groupId].category.next_move
//       )
//     }
//   } while (
//     addonMap[groupId] &&
//     (groupId = addonMap[groupId].category.next_move)
//   )
//   return ids
// }

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

const transform: Schema<MenuEntity, FoodHubMenu> = {
  categories: ({ categories }) =>
    categories.map((category) => {
      return {
        id: String(category.partner_id || category.id),
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
          String(subcat.partner_id || subcat.id)
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
          console.log(subcat.id);
          return {
            id: String(subcat.partner_id || subcat.id),
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
              String(item.partner_id || item.id)
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
              .map((item) => {
                console.log("item", item.id);
                return {
                  id: item.partner_id || String(item.id),
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
                  nutrition_info: item.nutrition
                    ? JSON.parse(item.nutrition)
                    : undefined,
                  show_online: Boolean(item.show_online),
                  number_of_servings: item.number_of_servings,
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
                  modifier_groups: item.next_moves.map((x) => {
                    return addons.category
                      ? addons.category.find((cat) => cat.id === Number(x))
                          ?.partner_id || x
                      : "";
                  }),
                };
              })
              .flat()
          )
          .flat()
      )
      .flat(),

  modifier_groups: ({ addons }) =>
    addons.category.map((category) => {
      console.log(category.id);
      return {
        id: String(category.partner_id || category.id),
        name: category.name,
        description: category.description,
        modifiers: category.next_moves?.map((x) =>
          addons.addon
            ? addons.addon.find((don) => don.id === Number(x))?.partner_id || x
            : ""
        ),
      };
    }),

  modifiers: ({ addons }) =>
    addons.addon.map((don) => ({
      id: String(don.partner_id || don.id),
      name: don.name,
      price:
        don.tax_percentage && don.tax_percentage > 0
          ? getOriginalPriceExludingVat(
              parseFloat(don.price) * 100,
              don.tax_percentage / 100
            )
          : parseFloat(don.price) * 100,
      offer: don.offer,
      show_online: Boolean(don.show_online),
      tax_percentage:
        don.tax_percentage !== null ? Number(don.tax_percentage) : undefined,
      is_tax_included: !(don.tax_percentage && don.tax_percentage > 0),
      min_permitted: don.type === "RADIO" ? 1 : 0,
      max_permitted: don.type === "MULTI" ? 0 : undefined,
      dietary_labels: don.suitable_diet
        ? JSON.parse(don.suitable_diet)
        : undefined,
      nutrition_info: don.nutrition ? JSON.parse(don.nutrition) : undefined,
      modifier_groups: don.next_moves.map(
        (x: any) =>
          addons.category.find((cat) => cat.id === Number(x))?.partner_id || x
      ),
    })),
};

/**
 *
 */
export const transformLegacyMenuToPartnerMenu = morphism(transform);
