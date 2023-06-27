import { PriceConfig } from "./types.d";

/**
 * Takes our suitable_diet_string eg '["VEGETARIAN","VEGAN","GLUTEN_FREE"]'
 * and maps to urban pipers '1'=Vegetarian , '2'=Non-vegetarian or '4'= Not specified
 */
export const suitableDietToUPFoodType = (
  suitableDiet: string
): "1" | "2" | "4" => {
  if (suitableDiet) {
    if (/non-vegetarian/i.test(suitableDiet)) {
      return "2";
    } else if (/vegetarian/i.test(suitableDiet)) {
      return "1";
    }
  }

  return "4";
};

export const calculatePrice = (config: PriceConfig): number => {
  let workingPrice = config.basePrice;
  if (config.baseIncreasePercentage) {
    workingPrice += workingPrice * (config.baseIncreasePercentage / 100);
  }
  if (config.vatPercentage) {
    workingPrice += workingPrice * (config.vatPercentage / 100);
  }
  workingPrice = priceAdjust(workingPrice.toFixed(2));
  return workingPrice;
};

export const priceAdjust = (price: string) => {
  const decimal = price.split(".")[1];
  let adjValue = (5 - (+decimal % 5)) / 100;
  adjValue = adjValue % 0.05 === 0 ? 0.0 : adjValue;
  return Number((+price + adjValue).toFixed(2)); //round 0.05
};
