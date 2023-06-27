export const getOriginalPriceExludingVat = (
  grossAmount: number,
  tax_percentage: number
) => {
  return Math.round(grossAmount - grossAmount / (1 + 1 / tax_percentage));
};

export const checkFalsyValues = (value) => {
  return [false, 0, "", ``, "", null, undefined, NaN, "NULL", "0"].includes(
    value
  );
};
