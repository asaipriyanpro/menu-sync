export const errorPrefix = "preflightCheckFailure:";
/**
 * Determines if a next_move type pointer has a real value
 * eg Zero is not a real value as there is no record zero in the database.
 */
const referenceValuePresent = (value) => {
    return !!(value && value !== 0 && value !== "0");
};
/**
 * This method just gives a single point where all preflight-check failures will be sent to.
 * Currently it simply logs a warning - but it could be altered to send a message to Cliq etc.
 */
const logPreflightFailure = (message, errorList) => {
    console.warn(message);
    errorList.push(message);
};
const markMaxDepth = (storeId, addonData, addonCat, idPath, errorList) => {
    if (!addonCat) {
        errorList.push(`${errorPrefix} storeId: ${storeId} - no addonCat passed to markMaxDepth()`);
        return;
    }
    if (idPath.includes(addonCat.category.id.toString())) {
        /**
         * We've found a loop
         * Halt so we do not cause a stack overflow
         */
        console.log({ cat: addonCat._maxSubtreeDepth, idlen: idPath.length });
        addonCat._maxSubtreeDepth = Math.max(addonCat._maxSubtreeDepth || 0, idPath.length);
        console.log({ value: addonCat.category.id });
        logPreflightFailure(`${errorPrefix} storeId: ${storeId} - Addon Category loop: ${idPath},${addonCat.category.id}`, errorList);
        return;
    }
    console.log(addonCat.category.next_move);
    if (referenceValuePresent(addonCat.category.next_move)) {
        // get sibling max depth
        const siblingCategory = addonData[addonCat.category.next_move];
        if (!siblingCategory) {
            logPreflightFailure(`${errorPrefix} storeId: ${storeId} - addonCat id:${addonCat.category.id} ${addonCat.category.name} referenced missing next_move ${addonCat.category.next_move}`, errorList);
        }
        else {
            /**
             * Sibling category is present
             */
            markMaxDepth(storeId, addonData, siblingCategory, [...idPath, addonCat.category.id.toString()], errorList);
            if (errorList.length > 0) {
                return;
            }
            // if sibling subtree goes deeper - its our depth too
            addonCat._maxSubtreeDepth = Math.max(addonCat._maxSubtreeDepth || 0, siblingCategory._maxSubtreeDepth || 0);
        }
    }
    if (addonCat.addon) {
        for (const addon of addonCat.addon) {
            if (referenceValuePresent(addon.next_move)) {
                const childCategory = addonData[addon.next_move];
                if (!childCategory) {
                    const message = `${errorPrefix} storeId: ${storeId} - addon ${addon.id} specifies invalid next_move = ${addon.next_move}`;
                    logPreflightFailure(message, errorList);
                    return;
                }
                else {
                    markMaxDepth(storeId, addonData, childCategory, [...idPath, addonCat.category.id.toString()], errorList);
                    if (errorList.length > 0) {
                        return;
                    }
                    // as this is a child, our depth is 1 + childsDepth
                    addonCat._maxSubtreeDepth = Math.max(addonCat._maxSubtreeDepth || 0, 1 + (childCategory._maxSubtreeDepth || 0));
                }
            }
        }
    }
    /**
     * if we have no max depth yet this is a leaf - so the depth is 1
     */
    console.log(addonCat._maxSubtreeDepth);
    if (!addonCat._maxSubtreeDepth) {
        addonCat._maxSubtreeDepth = 1;
    }
};
export const performPreflightCheck = (storeId, itemCategoriesList, mapOfAddonCategories) => {
    let errorList = [];
    for (const [_, addonCat] of Object.entries(mapOfAddonCategories)) {
        /**
         * Record max depth of subtree against each addonCat
         */
        markMaxDepth(storeId, mapOfAddonCategories, addonCat, [], errorList);
    }
    /**
     * every addonCat now has a ._maxSubtreeDepth
     */
    for (const itemCategory of itemCategoriesList) {
        for (const itemSubcategory of itemCategory.subcat) {
            for (const item of itemSubcategory.item) {
                if (referenceValuePresent(item.item_addon_cat)) {
                    const rootAddonCat = mapOfAddonCategories[item.item_addon_cat];
                    if (!rootAddonCat) {
                        logPreflightFailure(`${errorPrefix} storeId: ${storeId} - item id: ${item.id} specified invalid item.item_addon_cat of: ` +
                            item.item_addon_cat, errorList);
                    }
                    else if (rootAddonCat._maxSubtreeDepth > 2) {
                        logPreflightFailure(`${errorPrefix} storeId: ${storeId} - depth of addon tree for '${item.name}' id:${item.id} is : ${rootAddonCat._maxSubtreeDepth}`, errorList);
                    }
                }
            }
        }
    }
    return errorList;
};
//# sourceMappingURL=preflight-check.js.map