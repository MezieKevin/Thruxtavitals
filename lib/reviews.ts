export type Review = {
  id: string;
  productSlug: "coq10" | "testosterone-booster-plus";
  author: string;
  initials: string;
  rating: 5;
  relativeTime: string;
  body: string;
  helpful: number;
};

export const REVIEWS: Review[] = [
  {
    id: "1",
    productSlug: "coq10",
    author: "Chinedu O.",
    initials: "C",
    rating: 5,
    relativeTime: "3 months ago",
    body: "My doctor mentioned CoQ10 with lifestyle changes. Two months on this 200 mg — I’m less wiped after work and walks feel easier.",
    helpful: 42,
  },
  {
    id: "2",
    productSlug: "coq10",
    author: "Adaeze M.",
    initials: "A",
    rating: 5,
    relativeTime: "5 months ago",
    body: "Clear label, 120 caps, no weird aftertaste. Morning routine sorted.",
    helpful: 18,
  },
  {
    id: "3",
    productSlug: "testosterone-booster-plus",
    author: "Tunde R.",
    initials: "T",
    rating: 5,
    relativeTime: "2 months ago",
    body: "Wanted herbs before anything stronger. Training feels steadier and I’m sleeping better.",
    helpful: 31,
  },
  {
    id: "4",
    productSlug: "testosterone-booster-plus",
    author: "Emeka K.",
    initials: "E",
    rating: 5,
    relativeTime: "1 month ago",
    body: "Veg caps, easy instructions. Support helped with meal timing — reordered for my brother too.",
    helpful: 12,
  },
  {
    id: "5",
    productSlug: "coq10",
    author: "Funke A.",
    initials: "F",
    rating: 5,
    relativeTime: "6 weeks ago",
    body: "Desk job + wanted heart support. CoQ10 every morning — simple habit, steady energy.",
    helpful: 27,
  },
  {
    id: "6",
    productSlug: "testosterone-booster-plus",
    author: "Ibrahim S.",
    initials: "I",
    rating: 5,
    relativeTime: "4 months ago",
    body: "Stressful quarter — more drive and focus. I sleep more and drink water; this caps it off for me.",
    helpful: 56,
  },
];

export function reviewsForProduct(slug: string): Review[] {
  return REVIEWS.filter((r) => r.productSlug === slug);
}
