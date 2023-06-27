var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { get } from "./lib/AbstractHttpClient";
import { resolve } from "./lib/transforms";
import { performPreflightCheck } from "./lib/preflight-check";
import { addons } from "./lib/addons";
import { categorys } from "./lib/items";
const treat_bad_addoncategory_nextmove_as_null = true;
const treat_bad_addon_nextmove_as_null = true;
const listDrops = true;
const haltOnLoopInPath = false;
const valuePresent = (value) => {
    return value && value !== 0 && value !== "0";
};
let deepestAddonTreeSeen = 0;
const markMaxDepth = (addonData, addonCat, idPath) => {
    if (!addonCat) {
        console.log("No addonCat passed");
        return;
    }
    if (idPath.includes(addonCat.category.id)) {
        /**
         * We've found a loop
         * Halt so we do not cause a stack overflow
         */
        addonCat._maxSubtreeDepth = Math.max(addonCat._maxSubtreeDepth || 0, idPath.length);
        if (haltOnLoopInPath) {
            throw new Error("Loop in path");
        }
        console.log("Addon Category loop: " + idPath + " " + addonCat.category.id);
        return;
    }
    if (valuePresent(addonCat.category.next_move)) {
        // get sibling max depth
        const siblingCategory = addonData[addonCat.category.next_move];
        if (!siblingCategory) {
            console.log(`addonCat ${addonCat.category.id} ${addonCat.category.name} referenced missing next_move ${addonCat.category.next_move}`);
            if (treat_bad_addoncategory_nextmove_as_null) {
                addonCat.category.next_move = null;
            }
            else {
                throw new Error("bang 1");
            }
        }
        else {
            /**
             * Sibling category is present
             */
            markMaxDepth(addonData, siblingCategory, [
                ...idPath,
                addonCat.category.id,
            ]);
            // if sibling subtree goes deeper - its our depth too
            addonCat._maxSubtreeDepth = Math.max(addonCat._maxSubtreeDepth || 0, siblingCategory._maxSubtreeDepth);
        }
    }
    if (addonCat.addon) {
        for (const addon of addonCat.addon) {
            if (valuePresent(addon.next_move)) {
                const childCategory = addonData[addon.next_move];
                if (!childCategory) {
                    const message = `addon ${addon.id} specifies non existent next_move = ${addon.next_move}`;
                    console.log(message);
                    if (treat_bad_addon_nextmove_as_null) {
                        addon.next_move = null;
                    }
                    else {
                        throw new Error(message);
                    }
                }
                else {
                    markMaxDepth(addonData, childCategory, [
                        ...idPath,
                        addonCat.category.id,
                    ]);
                    // as this is a child, our depth is 1 + childsDepth
                    addonCat._maxSubtreeDepth = Math.max(addonCat._maxSubtreeDepth || 0, 1 + childCategory._maxSubtreeDepth);
                }
            }
        }
    }
    /**
     *if we have no max depth yet this is a leaf - so the depth is 1
     */
    if (!addonCat._maxSubtreeDepth) {
        addonCat._maxSubtreeDepth = 1;
    }
    if (addonCat._maxSubtreeDepth > deepestAddonTreeSeen) {
        deepestAddonTreeSeen = addonCat._maxSubtreeDepth;
    }
};
const URLs = {
    prod: "https://foodhub.co.uk",
    sit: "https://sit-urbanpiper-uk.fhcdn.dev",
};
const performCheck = (name, storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const itemUrl = `${URLs.sit}/api/consumer/store/${storeId}/menu/foodhub/all.json`;
    const addonUrl = `${URLs.sit}/api/consumer/store/${storeId}/addons/all.json`;
    const itemFileContent = yield get(itemUrl, {});
    const addonFileContent = yield get(addonUrl, {});
    const itemData = resolve(itemFileContent.data.data[0]).data;
    const addonData = resolve(addonFileContent.data.data[0]).data;
    performPreflightCheck(8050558, categorys, addons);
});
const checkBatch = () => __awaiter(void 0, void 0, void 0, function* () {
    let items = [{ name: "", storeId: "8050558" }];
    let count = 0;
    for (let data of items) {
        try {
            count++;
            console.log(` ${count} / ${items.length} - ${data.storeId}`);
            yield performCheck(data.name, data.storeId);
        }
        catch (e) {
            console.log("ERROR: " + e);
        }
    }
});
checkBatch();
//# sourceMappingURL=index.js.map