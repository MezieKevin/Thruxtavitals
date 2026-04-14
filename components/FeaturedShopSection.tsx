import Link from "next/link";
import { FeaturedShopInteractive } from "@/components/FeaturedShopInteractive";

type FeaturedShopSectionProps = {
  id?: string;
  showViewAll?: boolean;
  /** Hide the headline row (used on /shop where the page has its own title). */
  omitTitleRow?: boolean;
};

export function FeaturedShopSection({
  id = "featured-shop",
  showViewAll = true,
  omitTitleRow = false,
}: FeaturedShopSectionProps) {
  return (
    <section
      id={id}
      className="border-t border-black/10 bg-zinc-50 px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        {!omitTitleRow ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                Our{" "}
                <span className="text-accent-outlined">bestsellers</span>
              </h2>
              <p className="mt-3 text-base text-black/55 sm:text-lg">
                CoQ10 for heart and energy. Men's vitality capsules. Clear labels,
                pay on delivery — we text you before anything ships.
              </p>
            </div>
            {showViewAll ? (
              <Link
                href="/shop"
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border-2 border-[#c9fa49] px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-[#c9fa49]/15"
              >
                See full shop
                <span aria-hidden className="text-base leading-none">
                  ↑
                </span>
              </Link>
            ) : null}
          </div>
        ) : null}

        <div className={omitTitleRow ? "" : "mt-10"}>
          <FeaturedShopInteractive />
        </div>
      </div>
    </section>
  );
}
