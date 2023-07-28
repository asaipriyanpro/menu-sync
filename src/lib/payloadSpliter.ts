import { UrbanPiperPayload } from "./types.d";

const splitArray = <T>(target: T[], pageSize: number): T[][] => {
  const chunks: T[][] = [];
  let offset = 0;

  while (offset < target.length) {
    chunks.push(target.slice(offset, (offset += pageSize)));
  }
  return chunks;
};

const splitItemPayloads = (
  fullPayload: UrbanPiperPayload,
  pageSize: number
) => {
  const pages: UrbanPiperPayload[] = splitArray(
    fullPayload.items,
    pageSize
  ).map(
    (pageOfItems) =>
      ({
        categories: fullPayload.categories,
        items: pageOfItems,
        option_groups: [],
        options: [],
        taxes: [],
        charges: [],
      } as UrbanPiperPayload)
  );

  return pages;
};

const splitOptionPayloads = (
  fullPayload: UrbanPiperPayload,
  pageSize: number
) => {
  const pages: UrbanPiperPayload[] = splitArray(
    fullPayload.options,
    pageSize
  ).map(
    (pageOfOptions) =>
      ({
        categories: [],
        items: [],
        option_groups: fullPayload.option_groups,
        options: pageOfOptions,
        taxes: [],
        charges: [],
      } as UrbanPiperPayload)
  );

  return pages;
};

export const splitPayloads = (
  fullPayload: UrbanPiperPayload,
  itemsPerPage: number,
  optionsPerPage: number
): UrbanPiperPayload[] => {
  if (
    fullPayload.items.length <= itemsPerPage &&
    fullPayload.options.length <= optionsPerPage
  ) {
    /**
     * No splitting necessary
     */
    return [fullPayload];
  }

  // We must send in order categories, items, option-group, options

  return [
    ...splitItemPayloads(fullPayload, itemsPerPage),
    ...splitOptionPayloads(fullPayload, optionsPerPage),
  ];
};
