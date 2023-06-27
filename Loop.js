const items = [
  {
    quantity: 1,
    notes: "NIL",
    addons: [
      {
        quantity: 1,
        price: 0,
        name: "New Hand Tossed",
        modifier_group_name: "Crust",
        id: "6298629cbf83f8d7f498e172",
        addons: [
          {
            quantity: 1,
            price: 10,
            name: "Regular",
            modifier_group_name: "Size",
            id: "6298629cbf83f8d7f498e172",
            addons: [
              {
                quantity: 1,
                price: 10,
                name: "Extra Cheese",
                modifier_group_name: "Toppings",
                id: "6298629cbf83f8d7f498e172",
              },
              {
                quantity: 1,
                price: 10,
                name: "Onion",
                modifier_group_name: "Toppings",
                id: "6298629cbf83f8d7f498e172",
              },
            ],
          },
        ],
      },
    ],
    price: 1000,
    name: "The 4 Cheese Pizza",
    id: "6296f65dd6fb2646fd6547af",
  },
  {
    quantity: 1,
    notes: "Make it spicy",
    addons: [
      {
        quantity: 1,
        price: 10,
        name: "BBQ Sauce",
        id: "629862ee208f398887a2897f",
      },
      {
        quantity: 1,
        price: 100,
        name: "Chips/Fries",
        id: "PA0303",
      },
      {
        quantity: 1,
        price: 100,
        name: "Pepsi",
        id: "62986467bf83f8d7f498e1aa",
      },
    ],
    price: 600,
    name: "The 4 Cheese Pizza",
    id: "6296f6a8d92764800b4911ba",
  },
];

const addons = (items) => {
  const modifier_group_names = [];
  for (const addon of items) {
    if (!modifier_group_names.includes(addon.modifier_group_name)) {
      modifier_group_names.push(addon.modifier_group_name);
    }
    if (addon.addons && addon.addons.length) {
      addons(addon.addons);
    }
  }
};

addons(items[0].addons);
