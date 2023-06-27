import { StoreAvailability, StoreInfo } from "./type";
import { basicTransformer } from "./uber";

export const UberMenuSync = (categories, addons) => {
  const storeAvailability: StoreAvailability[] = [
    {
      service_type: "collection",
      business_date: "2023-05-14T00:00:00.000Z",
      day: "sunday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "collection",
      business_date: "2023-05-14T00:00:00.000Z",
      day: "sunday",
      open_at: "00:01",
      close_at: "04:59",
    },
    {
      service_type: "collection",
      business_date: "2023-05-15T00:00:00.000Z",
      day: "monday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "collection",
      business_date: "2023-05-15T00:00:00.000Z",
      day: "monday",
      open_at: "00:01",
      close_at: "04:59",
    },
    {
      service_type: "collection",
      business_date: "2023-05-16T00:00:00.000Z",
      day: "tuesday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "collection",
      business_date: "2023-05-16T00:00:00.000Z",
      day: "tuesday",
      open_at: "00:01",
      close_at: "04:59",
    },
    {
      service_type: "collection",
      business_date: "2023-05-17T00:00:00.000Z",
      day: "wednesday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "collection",
      business_date: "2023-05-18T00:00:00.000Z",
      day: "thursday",
      open_at: "00:01",
      close_at: "04:59",
    },
    {
      service_type: "collection",
      business_date: "2023-05-19T00:00:00.000Z",
      day: "friday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "collection",
      business_date: "2023-05-19T00:00:00.000Z",
      day: "friday",
      open_at: "00:01",
      close_at: "04:59",
    },
    {
      service_type: "collection",
      business_date: "2023-05-20T00:00:00.000Z",
      day: "saturday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "collection",
      business_date: "2023-05-20T00:00:00.000Z",
      day: "saturday",
      open_at: "00:01",
      close_at: "04:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-14T00:00:00.000Z",
      day: "sunday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-14T00:00:00.000Z",
      day: "sunday",
      open_at: "00:01",
      close_at: "04:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-15T00:00:00.000Z",
      day: "monday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-15T00:00:00.000Z",
      day: "monday",
      open_at: "00:01",
      close_at: "04:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-16T00:00:00.000Z",
      day: "tuesday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-16T00:00:00.000Z",
      day: "tuesday",
      open_at: "00:01",
      close_at: "04:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-17T00:00:00.000Z",
      day: "wednesday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-18T00:00:00.000Z",
      day: "thursday",
      open_at: "00:01",
      close_at: "04:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-19T00:00:00.000Z",
      day: "friday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-19T00:00:00.000Z",
      day: "friday",
      open_at: "00:01",
      close_at: "04:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-20T00:00:00.000Z",
      day: "saturday",
      open_at: "05:00",
      close_at: "23:59",
    },
    {
      service_type: "delivery",
      business_date: "2023-05-20T00:00:00.000Z",
      day: "saturday",
      open_at: "00:01",
      close_at: "04:59",
    },
  ];

  const store: StoreInfo = {
    id: 8050565,
    name: "Sit Web 3 UK Papas Coupon",
    host: "sit-web-3-uk.fhcdn.dev",
    description:
      "Serving up amazing food, Harvester  - Plough Surrey sits in the heart of Sutton. With dishes you're guaranteed to love, order now for delivery within 32 minutes",
    phone: "07380308571",
    logo_url:
      "https://public.touch2success.com/static/8291328396ff09f21ed4934794c89866/img/phpJOjtge.png",
    country_id: 1,
    iso3: "",
  };

  const menuArgs = {
    categories,
    addons,
    store,
    storeAvailability,
    priceHikePercent: 10,
  };

  /**
   * Generate a uber menu based on the menu and store details
   */
  const deliveryMenu = basicTransformer({
    menuType: "delivery",
    ...menuArgs,
  });

  const collectionMenu = basicTransformer({
    menuType: "collection",
    ...menuArgs,
  });

  

  return deliveryMenu;
};
