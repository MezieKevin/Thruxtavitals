export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  brand?: string;
  image: string;
  imageAlt: string;
  specs: string[];
  tagline: string;
  benefits: { title: string; description: string }[];
  detailIntro: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "coq10",
    name: "CoQ10",
    subtitle: "Ubiquinone Coenzyme Q10",
    brand: "New Leaf Products",
    image: "/images/CoQ10.jpeg",
    imageAlt: "CoQ10 supplement bottle with heart health branding",
    specs: [
      "200 mg ubiquinone CoQ10 per capsule",
      "120 capsules per bottle",
      "Food supplement for cardiovascular support",
    ],
    tagline: "Heart, circulation, and the energy to keep moving",
    benefits: [
      {
        title: "Heart you can invest in",
        description:
          "200 mg CoQ10 per cap — a daily habit many adults use alongside diet and exercise for cardiovascular wellness.",
      },
      {
        title: "Stay in the game",
        description:
          "Feel more like yourself on busy days: work, family, workouts — CoQ10 supports how your cells make energy.",
      },
      {
        title: "One bottle, clear dose",
        description:
          "120 capsules, label tells you exactly what you get. No guessing.",
      },
    ],
    detailIntro:
      "CoQ10 is what your cells use to help make energy. This 200 mg ubiquinone formula fits adults who want simple heart and stamina support alongside a balanced lifestyle.",
  },
  {
    slug: "testosterone-booster-plus",
    name: "Testosterone Booster Plus",
    subtitle: "Shilajit + Ashwagandha",
    image: "/images/testosterone.jpeg",
    imageAlt: "Testosterone Booster Plus bottle — Shilajit and Ashwagandha blend",
    specs: [
      "60 vegetarian capsules",
      "30 servings",
      "Dietary supplement",
    ],
    tagline: "Drive, stamina, and calm focus — for men on the go",
    benefits: [
      {
        title: "Confidence in your routine",
        description:
          "Shilajit and ashwagandha — herbs men use for motivation, mood, and get-up-and-go.",
      },
      {
        title: "Train, work, repeat",
        description:
          "Built to pair with sleep, food, and workouts — not replace them.",
      },
      {
        title: "Vegetarian capsules",
        description:
          "60 caps, 30 servings. Know what you swallow every morning.",
      },
    ],
    detailIntro:
      "A vegetarian blend of shilajit and ashwagandha for men who want herbal backup for vitality, stamina, and focus — best with real rest, food, and training.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
