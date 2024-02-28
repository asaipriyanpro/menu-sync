import { FHAddonCategoryMap } from "./type";

export const toId = (id: string | number, prefix?: string) => {
  return `${prefix ? `${prefix}:` : ""}${id}`;
};

export const resolveNextMoves = (
  groupId: string,
  addonMap: FHAddonCategoryMap
): string[] => {
  const ids = [];
  do {
    if (addonMap[groupId]?.category.next_move) {
      ids.push(addonMap[groupId].category.next_move);
    }
  } while ((groupId = addonMap[groupId]?.category.next_move));
  return ids;
};

export const priceInfo = (price: number, hikePercentage: number) =>
  Math.round((price + (price * hikePercentage) / 100) * 100);
