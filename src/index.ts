import { get } from "./lib/AbstractHttpClient";
import { resolve } from "./lib/transforms";
import {
  performPreflightCheck,
  removeFailedAddonsCats,
  removeFailedItems,
  removeAddons,
} from "./lib/preflight-check";
import * as fs from "fs";
import {
  convertCombinedModifiers,
  transformMenuToUrbanPiperPayload,
} from "./lib/transforms-v1";
import { splitPayloads } from "./lib/payloadSpliter";
import { StoreAvailability, StoreInfo } from "./uber/type";
import { partnerAPIMenu } from "./partner-api/index";
import { UberMenuSync } from "./uber/index";
import { deliverooMenu } from "./deliveroo/index";
import { doordashMenu } from "./doordash";

const URLs = {
  prod: "https://foodhub.co.uk",
  sit: "https://sit-urbanpiper-uk.fhcdn.dev",
};

const performCheck = async (storeId) => {
  const itemUrl = `${URLs.sit}/api/consumer/store/${storeId}/menu/foodhub/all.json`;
  const addonUrl = `${URLs.sit}/api/consumer/store/${storeId}/addons/all.json`;
  const addoV2Url = `${URLs.sit}/api/consumer/store/${storeId}/addons/v3/all.json`;

  const itemFileContent = await get(itemUrl, {});
  const addonFileContent = await get(addonUrl, {});
  const addonV2FileContent = await get(addoV2Url, {});

  let categories = resolve(itemFileContent.data.data[0])?.data;

  let addons = resolve(addonFileContent.data.data[0])?.data || {};

  let addonsV3 = resolve(addonV2FileContent.data.data[0])?.data || {};

  /**
   * Partner API menu
   */
  createFile("category.json", categories, 8050565);
  createFile("addons.json", addonsV3, 8050565);
  const preflight = performPreflightCheck(storeId, categories, addons);
  if (preflight.errorList.length) {
    console.log("loop", preflight.errorList);
  }

  if (false) {
    const menu = deliverooMenu(categories, addons);
    const { items, mealtimes, modifiers } = menu.menu;
    console.log({
      items: items.length,
      mealtimes: mealtimes.length,
      modifiers: modifiers.length,
    });
    createFile("deliveroo-menu.json", menu, storeId);
  }

  if (true) {
    console.log("commin");
    const menu = doordashMenu(categories, addons);
    createFile("doordash-menu.json", menu, storeId);
  }

  // addons = removeAddons(addons);
  if (preflight.failedAddonCatIds.length) {
    //   const output = [...new Set(preflight.failedAddonCatIds)];
    //   categories = removeFailedItems(categories, output);
    //   addons = removeFailedAddonsCats(addons, output);
    //   // createFile("removed_cat.json", categories);
    //   // createFile("removed_addon.json", addons);
    return;
  }
  if (true) {
    const uber = UberMenuSync(categories, addons, addonsV3);
    createFile("uber.json", uber, storeId);
    return;
  }

  if (false) {
    if (!fs.existsSync(`stores/${storeId}`)) {
      fs.mkdirSync(`stores/${storeId}`);
    }
    createFile(`stores/${storeId}/categories.json`, categories, storeId);
    addons && createFile(`stores/${storeId}/addons.json`, addons, storeId);
    // addonsV2 && createFile(`stores/${storeId}/addonV2.json`, addonsV2, storeId);
    const result = partnerAPIMenu(categories, addons, addonsV3);
    createFile(`stores/${storeId}/partner_api.json`, result, storeId);
    return;
  }

  // const preflight = performPreflightCheck(storeId, categories, addons);

  // if (preflight.failedAddonCatIds.length) {
  //   const output = [...new Set(preflight.failedAddonCatIds)];
  //   console.log(output);
  //   categories = removeFailedItems(categories, output);
  //   addons = removeFailedAddonsCats(addons, output);
  //   // createFile("removed_cat.json", categories);
  //   // createFile("removed_addon.json", addons);
  // }

  /**
   * Transform the menu into UrbanPiper format
   */

  const payload = transformMenuToUrbanPiperPayload(categories, addons, 15);
  if (true) {
    const modifiers = convertCombinedModifiers(payload.options, addons);
    console.log({ modifiers: payload.options.length });
    payload.options = modifiers;
  }

  console.log({
    category: payload.categories.filter((x) => !x.ref_id.includes("subcat"))
      .length,
    items: payload.items.length,
    modi_group: payload.option_groups.length,
    modifier: payload.options.length,
  });

  // createFile("payload.json", payload, storeId);

  // const ITEMS_PER_PAGE = 1000;
  // const splitPages = splitPayloads(payload, ITEMS_PER_PAGE, ITEMS_PER_PAGE);
  // splitPages.map((x, i) => {
  //   createFile(`${storeId}_${i + 1}.json`, x, storeId);
  // });
};

const checkBatch = async () => {
  //794608 801882 855659 8051218
  let items = [{ name: "Store 1", storeId: "8051235" }];
  for (let data of items) {
    try {
      await performCheck(data.storeId);
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }
  /**
   * Look multiple store
   */
  // for (let i = 802571; i < 802573; i++) {
  //   try {
  //     await performCheck(i);
  //   } catch (e) {
  //     console.log("ERROR: " + e);
  //   }
  // }
};

checkBatch();

export const createFile = (fileName, data, storeId) => {
  fs.writeFile(fileName, JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log(`file created ${storeId}`);
  });
};
