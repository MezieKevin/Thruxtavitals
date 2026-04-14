import { ClosingPitchSection } from "@/components/ClosingPitchSection";
import { DismissiblePromoGif } from "@/components/DismissiblePromoGif";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ShopProductGrid } from "@/components/ShopProductGrid";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { REVIEWS } from "@/lib/reviews";

export const metadata = {
  title: "Shop",
  description:
    "CoQ10 & men's vitality — filter by category, pay on delivery, order in minutes.",
};

export default function ShopPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-black/10 bg-black px-4 py-14 text-white sm:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-widest text-accent-outlined">
              Shop
            </p>
            <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Pick your product — pay when it arrives
            </h1>
            <p className="mt-4 max-w-xl text-white/75">
              Filter by category, open any bottle for full specs, then order in a
              few taps. We confirm on WhatsApp.
            </p>
          </div>
        </section>

        <div className="border-b border-black/10 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-6xl">
            <DismissiblePromoGif variant="inline" />
          </div>
        </div>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <ShopProductGrid />
        </section>

        <ReviewsSection reviews={REVIEWS} />

        <ClosingPitchSection />
      </main>
      <SiteFooter />
    </div>
  );
}
