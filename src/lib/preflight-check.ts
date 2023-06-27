/**
 * Simple set of types to keep typescript happy.
 */
interface Item {
  id: number;
  name: string;
  item_addon_cat: string;
}
interface ItemSubcategory {
  item: Item[];
}
interface ItemCategory {
  subcat: ItemSubcategory[];
}

interface preflightCheck {
  errorList: string[];
  failedAddonCatIds: string[];
}
export interface Addon {
  id: any;
  name: string;
  next_move: string | number;
}
export interface AddonCategory {
  _maxSubtreeDepth?: number;
  category: {
    id: number;
    name: string;
    next_move: string | number;
  };
  addon: Addon[];
}
type AddonCategoryMap = { [key: string | number]: AddonCategory };

export const errorPrefix = "preflightCheckFailure:";

/**
 * Determines if a next_move type pointer has a real value
 * eg Zero is not a real value as there is no record zero in the database.
 */
const referenceValuePresent = (value: number | string): boolean => {
  return !!(value && value !== 0 && value !== "0");
};

/**
 * This method just gives a single point where all preflight-check failures will be sent to.
 * Currently it simply logs a warning - but it could be altered to send a message to Cliq etc.
 */
const logPreflightFailure = (message: string, errorList: string[]) => {
  console.warn(message);
  errorList.push(message);
};

const addonCategoryIds = (id: number | string, ids: string[]) => {
  ids.push(String(id));
};

const markMaxDepth = (
  storeId: number,
  addonData: AddonCategoryMap,
  addonCat: AddonCategory,
  idPath: string[],
  errorList: string[],
  failedAddonCatIds: string[] = []
): void => {
  if (!addonCat) {
    errorList.push(
      `${errorPrefix} storeId: ${storeId} - no addonCat passed to markMaxDepth()`
    );
    return;
  }

  if (idPath.includes(addonCat.category.id.toString())) {
    /**
     * We've found a loop
     * Halt so we do not cause a stack overflow
     */
    addonCat._maxSubtreeDepth = Math.max(
      addonCat._maxSubtreeDepth || 0,
      idPath.length
    );

    logPreflightFailure(
      `${errorPrefix} storeId: ${storeId} - Addon Category loop: ${idPath},${addonCat.category.id}, ${addonCat.category.name}`,
      errorList
    );
    addonCategoryIds(addonCat.category.id, failedAddonCatIds);

    return;
  }

  if (referenceValuePresent(addonCat.category.next_move)) {
    // get sibling max depth
    const siblingCategory = addonData[addonCat.category.next_move];
    if (!siblingCategory) {
      logPreflightFailure(
        `${errorPrefix} storeId: ${storeId} - addonCat id:${addonCat.category.id} ${addonCat.category.name} referenced missing next_move ${addonCat.category.next_move}`,
        errorList
      );
      addonCategoryIds(addonCat.category.id, failedAddonCatIds);
    } else {
      /**
       * Sibling category is present
       */
      markMaxDepth(
        storeId,
        addonData,
        siblingCategory,
        [...idPath, addonCat.category.id.toString()],
        errorList,
        failedAddonCatIds
      );

      if (errorList.length > 0) {
        return;
      }

      // if sibling subtree goes deeper - its our depth too
      addonCat._maxSubtreeDepth = Math.max(
        addonCat._maxSubtreeDepth || 0,
        siblingCategory._maxSubtreeDepth || 0
      );
    }
  }

  if (addonCat.addon) {
    for (const addon of addonCat.addon) {
      if (referenceValuePresent(addon.next_move)) {
        const childCategory = addonData[addon.next_move];

        if (!childCategory) {
          const message = `${errorPrefix} storeId: ${storeId} - addon ${addon.id} (${addon.name})specifies invalid next_move = ${addon.next_move}`;
          logPreflightFailure(message, errorList);
          addonCategoryIds(addonCat.category.id, failedAddonCatIds);
          return;
        } else {
          markMaxDepth(
            storeId,
            addonData,
            childCategory,
            [...idPath, addonCat.category.id.toString()],
            errorList,
            failedAddonCatIds
          );

          if (errorList.length > 0) {
            return;
          }

          // as this is a child, our depth is 1 + childsDepth
          addonCat._maxSubtreeDepth = Math.max(
            addonCat._maxSubtreeDepth || 0,
            1 + (childCategory._maxSubtreeDepth || 0)
          );
        }
      }
    }
  }

  /**
   * if we have no max depth yet this is a leaf - so the depth is 1
   */
  if (!addonCat._maxSubtreeDepth) {
    addonCat._maxSubtreeDepth = 1;
  }
};

export const performPreflightCheck = (
  storeId: number,
  itemCategoriesList: ItemCategory[],
  mapOfAddonCategories: AddonCategoryMap
): preflightCheck => {
  let errorList: string[] = [];
  let failedAddonCatIds: string[] = [];
  let count = 0;
  if (mapOfAddonCategories) {
    for (const [_, addonCat] of Object.entries(mapOfAddonCategories)) {
      /**
       * Record max depth of subtree against each addonCat
       */

      markMaxDepth(
        storeId,
        mapOfAddonCategories,
        addonCat,
        [],
        errorList,
        failedAddonCatIds
      );
    }
  }

  /**
   * every addonCat now has a ._maxSubtreeDepth
   */
  for (const itemCategory of itemCategoriesList) {
    for (const itemSubcategory of itemCategory.subcat) {
      for (const item of itemSubcategory.item) {
        if (referenceValuePresent(item.item_addon_cat)) {
          const rootAddonCat = mapOfAddonCategories
            ? mapOfAddonCategories[item.item_addon_cat]
            : null;
          if (!rootAddonCat) {
            logPreflightFailure(
              `${errorPrefix} storeId: ${storeId} - item id: ${item.id} specified invalid item.item_addon_cat of: ` +
                item.item_addon_cat,
              errorList
            );
            addonCategoryIds(item.item_addon_cat, failedAddonCatIds);
          } else if (rootAddonCat._maxSubtreeDepth! > 2) {
            logPreflightFailure(
              `${errorPrefix} storeId: ${storeId} - depth of addon tree for '${item.name}' id:${item.id} is : ${rootAddonCat._maxSubtreeDepth}`,
              errorList
            );

            addonCategoryIds(item.item_addon_cat, failedAddonCatIds);
          }
        }
      }
    }
  }
  return { errorList, failedAddonCatIds };
};

export const removeFailedItems = (
  categories: ItemCategory[],
  failedAddonCatIds: string[]
): ItemCategory[] => {
  for (let category of categories) {
    for (let subcategory of category.subcat) {
      subcategory.item = subcategory.item.filter((item) => {
        return !failedAddonCatIds.includes(item.item_addon_cat);
      });
    }
  }
  return categories;
};

export const removeFailedAddonsCats = (
  addons: AddonCategoryMap,
  failedAddonCatIds: string[]
) => {
  failedAddonCatIds.map((item) => {
    delete addons[item];
  });
  return addons;
};

export const removeAddons = (addons: AddonCategory) => {
  for (let addonCat of Object.values(addons)) {
    addonCat.addon = addonCat.addon.filter((addon: any) => {
      return !["no", "free", "less"].includes(addon.name.toLowerCase());
    });
  }
  return addons;
};
