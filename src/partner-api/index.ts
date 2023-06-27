import { MenuEntity } from "./declarations";
import { transformLegacyV1MenuToPartnerMenu } from "./transform";
import { transformLegacyMenuToPartnerMenu } from "./transformv2";

export const partnerAPIMenu = (categories, addonsV1, addonsV2) => {
  let partnerAPiMenu: MenuEntity;
  if (addonsV2 && addonsV2.categories[0].next_moves.length) {
    console.log("addon V2");
    partnerAPiMenu = transformLegacyMenuToPartnerMenu({
      categories,
      addons: { category: addonsV2.categories, addon: addonsV2.addons },
    });
  } else {
    console.log("addon V1");
    partnerAPiMenu = transformLegacyV1MenuToPartnerMenu({
      categories,
      addons: addonsV1,
    });
  }
  if (partnerAPiMenu) {
    console.log({
      categories: partnerAPiMenu.categories.length,
      subcategories: partnerAPiMenu.subcategories.length,
      item: partnerAPiMenu.items.length,
      modifier_groups: partnerAPiMenu.modifier_groups.length,
      modifiers: partnerAPiMenu.modifiers.length,
    });
  }
  return partnerAPiMenu;
};
