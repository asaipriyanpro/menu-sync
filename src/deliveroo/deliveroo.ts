import {
  DeliverooCategories,
  DeliverooItems,
  DeliverooMealtimes,
  DeliverooMenu,
  DeliverooModifiers,
  FHAddonCategoryMap,
  FHItem,
  FoodhubCagtegory,
  NutritionalInfo,
  Schedule,
  StoreAvailability,
  StoreInfo,
} from "./type";
import { toId, resolveNextMoves, priceInfo } from "./utils";

export const transformMenuToDeliverooPayload = (
  store: StoreInfo,
  storeAvailability: StoreAvailability[],
  categories: FoodhubCagtegory[],
  addons: FHAddonCategoryMap,
  priceHikePercent: number
): DeliverooMenu => {
  return {
    name: store.name,
    menu: {
      categories: getCategories(categories),
      mealtimes: getMealTimes(categories, store, storeAvailability),
      items: getItems(categories, addons, priceHikePercent),
      modifiers: getModifier(addons),
    },
    site_ids: [`${store.id}`],
  };
};

const getMealTimes = (
  categories: FoodhubCagtegory[],
  store: StoreInfo,
  storeAvailability: StoreAvailability[]
): DeliverooMealtimes[] => {
  const availablity = [];
  const delivery = serviceAvailability(storeAvailability, "delivery");
  const collection = serviceAvailability(storeAvailability, "collection");
  delivery.length && availablity.push(delivery);
  collection.length && availablity.push(collection);

  return availablity.map((schedule) => ({
    id: `store:${store.id}`,
    name: {
      en: store.name,
    },
    description: {
      en: store.description,
    },
    image: {
      url: store.logo_url,
    },
    schedule: [],
    category_ids: categories
      .map((category) =>
        category.subcat.map((subcat) => toId(subcat.id, "fh_category"))
      )
      .flat(),
  }));
};
const getCategories = (
  categories: FoodhubCagtegory[]
): DeliverooCategories[] => {
  return categories
    .map((category) =>
      category.subcat.map<DeliverooCategories>((subcat) => {
        return {
          id: toId(subcat.id, "fh_category"),
          name: {
            en: subcat.name,
          },
          description: {
            en: subcat.description,
          },
          item_ids: subcat.item.map((item) => toId(item.id, "fh_item")),
        };
      })
    )
    .flat();
};
const getItems = (
  categories: FoodhubCagtegory[],
  addons: FHAddonCategoryMap,
  priceHikePercent: number
): DeliverooItems[] => {
  const items: FHItem[] = categories
    .map((category) => category.subcat.map((subcat) => subcat.item).flat())
    .flat();

  return [
    items.map((item): DeliverooItems => {
      if (item.name.length > 110) {
        console.log(item);
      }
      if (item.name.length < 2) {
        console.log(item);
      }

      return {
        id: toId(item.id, "fh_item"),
        name: {
          en: item.name,
        },
        description: {
          en: item.description,
        },
        image: {
          url: item.aws_image || item.image,
        },
        nutritional_info: nutritionalInfo(item.nutrition),
        plu: toId(item.id, "fh_item"),
        contains_alcohol: false,
        modifier_ids:
          Number(item.item_addon_cat) > 0
            ? [
                // first move
                toId(item.item_addon_cat, "fh_addon-cat"),
                // get each of the enxt move in order
                ...resolveNextMoves(item.item_addon_cat, addons).map((id) =>
                  toId(id, "fh_addon-cat")
                ),
              ]
            : [],

        price_info: priceInfo(+item.price, priceHikePercent),
        tax_rate: "0.0",
        type: "ITEM",
      };
    }),

    Object.values(addons)
      .map(({ addon }) =>
        addon
          .map((addon): DeliverooItems => {
            if (addon.name.length > 120) {
              console.log(addon);
            }
            if (addon.name.length < 2) {
              console.log(addon);
            }
            return {
              id: toId(addon.id, "fh_addon"),
              name: { en: addon.name },
              price_info: priceInfo(+addon.price, priceHikePercent),
              tax_rate: "0.0",
              contains_alcohol: false,
              type: "CHOICE",
              plu: toId(addon.id, "fh_addon"),
              modifier_ids: addon.next_move
                ? [
                    addon.next_move,
                    ...resolveNextMoves(addon.next_move, addons),
                  ].map((id) => toId(id, "fh_addon-cat"))
                : [],
            };
          })
          .flat()
      )
      .flat(),
  ].flat();
};
const getModifier = (addons: FHAddonCategoryMap): DeliverooModifiers[] =>
  Object.values(addons).map(
    ({ category, addon }): DeliverooModifiers => ({
      id: toId(category.id, "fh_addon-cat"),
      name: {
        en: category.name,
      },
      min_selection: addon.length > 0 && addon[0].type === "radio" ? 1 : 0,
      max_selection:
        addon.length > 0 && addon[0].type === "radio" ? 1 : addon.length,
      item_ids: addon.map(({ id }) => toId(id, "fh_addon")),
    })
  );

// Store open and close availablity collect
const serviceAvailability = (
  serviceAvailable: StoreAvailability[],
  type: "delivery" | "collection"
): Schedule[] => {
  const days = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6,
  };
  const result = [];

  for (let store of serviceAvailable) {
    if (store.service_type === type) {
      if (!result[days[store.day]]) {
        result[days[store.day]] = {
          day_of_week: days[store.day],
          time_periods: [],
        };
      }
      result[days[store.day]].time_periods.push({
        start: store.open_at,
        end: store.close_at,
      });
    }
  }
  // Remove undefined elements in the result array
  const filteredResult = result.filter(Boolean);
  return filteredResult;
};

const nutritionalInfo = (nutrition: string): NutritionalInfo | {} => {
  if (nutrition) {
    const nutritionInfo = JSON.parse(nutrition);
    if (nutritionInfo?.calories?.value) {
      const value = nutritionInfo.calories.value.split("-");
      return {
        energy_kcal: {
          low: Number(value[0]),
          high: Number(value[1]),
        },
      };
    }
  }

  return {};
};
