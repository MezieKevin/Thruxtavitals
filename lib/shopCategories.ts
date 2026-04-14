export type ShopCategory = {
  id: string;
  label: string;
  countLabel: string;
  emoji: string;
};

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    id: "all",
    label: "Everything",
    countLabel: "Both products",
    emoji: "🛒",
  },
  {
    id: "heart",
    label: "Heart & energy",
    countLabel: "CoQ10",
    emoji: "❤️",
  },
  {
    id: "vitality",
    label: "Men's vitality",
    countLabel: "Herbal blend",
    emoji: "🌿",
  },
  {
    id: "mens-sexual",
    label: "Men's wellness",
    countLabel: "Drive & stamina",
    emoji: "🔥",
  },
];
