import {
  DoorDashMenu,
  FHAddonCategoryMap,
  FHItem,
  FoodhubCagtegory,
  ItemExtras,
  MenuCategory,
  MenuItem,
  StoreAvailability,
  StoreInfo,
} from "./type";
import { priceInfo, toId } from "./utils";

export const transformMenuToDoorDashPayload = (
  store: StoreInfo,
  storeAvailability: StoreAvailability[],
  categories: FoodhubCagtegory[],
  addons: FHAddonCategoryMap,
  priceHikePercent: number
): DoorDashMenu => {
  return {
    reference: `${store.id}`,
    store: {
      merchant_supplied_id: `${store.id}`,
      provider_type: "foodhub_aggregator_sandbox",
    },
    open_hours: serviceAvailability(storeAvailability),
    special_hours: [],
    menu: {
      name: store.name,
      subtitle: store.description,
      active: true,
      categories: getCategories(categories, addons, priceHikePercent),
    },
  };
};

const getCategories = (
  categories: FoodhubCagtegory[],
  addons: FHAddonCategoryMap,
  priceHikePercent: number
): MenuCategory[] => {
  return categories
    .map((category) =>
      category.subcat.map((subcat) => ({
        merchant_supplied_id: toId(subcat.id, "fh_category"),
        name: subcat.name,
        sort_id: subcat.pos,
        subtitle: subcat.description,
        items: getItems(subcat.item, addons, priceHikePercent).flat(),
      }))
    )
    .flat();
};

const getItems = (
  items: FHItem[],
  addons: FHAddonCategoryMap,
  priceHikePercent: number
): MenuItem[] => {
  return items.map((item) => ({
    merchant_supplied_id: toId(item.id, "fh_item"),
    name: item.name,
    description: item.description,
    price: priceInfo(+item.price, priceHikePercent) || 0,
    original_image_url: item.image,
    sort_id: item.pos,
    extras:
      item.item_addon_cat && item.item_addon_cat != "0"
        ? getModifierGroupAndModifiers(
            item.item_addon_cat,
            addons,
            priceHikePercent
          )
        : [],
  }));
};

const getModifierGroupAndModifiers = (
  item_addon_cat_id: string,
  addons: FHAddonCategoryMap,
  priceHikePercent: number
): ItemExtras[] => {
  const modifierGroup = addons[item_addon_cat_id];
  if (!modifierGroup) {
    return [];
  }

  return nestedModifierGroup(
    addons,
    modifierGroup.category.id,
    priceHikePercent,
    []
  );
};

function nestedModifierGroup(
  data: FHAddonCategoryMap,
  id: number | string,
  priceHikePercent: number,
  categories?: ItemExtras[]
) {
  const output: ItemExtras = {
    name: data[id].category.name,
    sort_id: data[id].category.pos,
    merchant_supplied_id: toId(data[id].category.id, "fh_addon_cat"),
    min_num_options:
      data[id].addon.length > 0 && data[id].addon[0].type === "radio" ? 1 : 0,
    max_num_options:
      data[id].addon.length > 0 && data[id].addon[0].type === "radio"
        ? 1
        : data[id].addon.length,

    options: data[id].addon.map((addon) => ({
      merchant_supplied_id: toId(addon.id, "fh_addon"),
      name: addon.name,
      sort_id: addon.pos,
      price: priceInfo(+addon.price, priceHikePercent) || 0,
      extras: addon.next_move
        ? nestedModifierGroup(data, addon.next_move, priceHikePercent)
        : [],
    })),
  };

  categories = categories || [];
  categories.push(output);

  if (data[id].category.next_move) {
    nestedModifierGroup(
      data,
      data[id].category.next_move,
      priceHikePercent,
      categories
    );
  }
  return categories;
}

const serviceAvailability = (store: StoreAvailability[]) => {
  if (!store.length) return [];
  const days = {
    sunday: "SUN",
    monday: "MON",
    tuesday: "TUE",
    wednesday: "WED",
    thursday: "THU",
    friday: "FRI",
    saturday: "SAT",
  };
  return store.map((item) => ({
    day_index: days[item.day],
    start_time: item.open_at,
    end_time: item.close_at,
  }));
};
