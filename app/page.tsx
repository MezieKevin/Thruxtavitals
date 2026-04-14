import Link from "next/link";
import { ClosingPitchSection } from "@/components/ClosingPitchSection";
import { DismissiblePromoGif } from "@/components/DismissiblePromoGif";
import { FeaturedShopSection } from "@/components/FeaturedShopSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { REVIEWS } from "@/lib/reviews";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6 sm:py-28">
          <div
            className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-[#c9fa49]/25 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-widest text-accent-outlined">
              Heart · energy · men's vitality
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl sm:leading-tight">
              Supplements that fit real life — clear labels, pay on delivery
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/75">
              CoQ10 for heart and stamina. A herbal vitality blend for drive and
              energy. Pick your bottle, checkout is fast, we confirm on WhatsApp.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-[#c9fa49] px-8 py-4 text-base font-semibold text-black transition hover:brightness-95"
              >
                Shop now
              </Link>
              <a
                href="#featured-shop"
                className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 text-base font-semibold text-white transition hover:bg-white hover:text-black"
              >
                See bestsellers
              </a>
            </div>
          </div>
        </section>

        <div className="border-b border-black/10 bg-zinc-50 px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-6xl">
            <DismissiblePromoGif variant="inline" />
          </div>
        </div>

        <section
          id="about"
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                Why buy from us
              </h2>
              <p className="mt-4 text-black/75">
                Two products, no clutter: CoQ10 for heart and daily energy, plus
                a men's vitality blend you can read about in plain English.
              </p>
              <p className="mt-4 text-black/75">
                Dosing and bottle size are on every page. Order online, pay when
                it arrives, and message us anytime on WhatsApp.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-black bg-[#c9fa49]/15 p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
                What you get
              </h3>
              <ul className="mt-6 space-y-4 text-black/80">
                <li className="flex gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-black bg-[#c9fa49]"
                    aria-hidden
                  />
                  Real mg counts and servings — no fine-print surprises.
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-black bg-[#c9fa49]"
                    aria-hidden
                  />
                  Full product pages: what it is, why people take it, how to use
                  it.
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-black bg-[#c9fa49]"
                    aria-hidden
                  />
                  Checkout in one flow: your details, qty, pay on delivery.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <FeaturedShopSection />

        <ReviewsSection
          title="What buyers say"
          reviews={REVIEWS}
          summaryLabel="5.0 average · real feedback on CoQ10 & Vitality Plus"
        />

        <ClosingPitchSection />

        <section className="mx-auto max-w-6xl px-4 pt-16 pb-14 text-center sm:px-6 sm:pb-16">
          <h2 className="text-2xl font-semibold text-black sm:text-3xl">
            Start your order
          </h2>
          <p className="mt-3 text-black/65">
            Choose a product, tap order, we reach out to confirm delivery and
            payment (pay when you receive).
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-full bg-black px-10 py-4 text-base font-semibold text-white hover:bg-black/90"
          >
            Shop all products
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
