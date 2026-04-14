import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  OtherProductsCarousel,
  type CrossSellItem,
} from "@/components/OtherProductsCarousel";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { DismissiblePromoGif } from "@/components/DismissiblePromoGif";
import { ProductOrderActions } from "@/components/ProductOrderActions";
import { getProductBySlug, PRODUCTS } from "@/lib/products";
import { reviewsForProduct } from "@/lib/reviews";

type Props = { params: Promise<{ slug: string }> };

/** Repeat cross-sell items to fill the carousel (preview layout until more SKUs exist). */
const CROSS_SELL_CAROUSEL_SLOTS = 6;

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product | Thruxta Vitals" };
  return {
    title: `${product.name} | Shop | Thruxta Vitals`,
    description: product.detailIntro.slice(0, 160),
  };
}

export default async function ProductOrderPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productReviews = reviewsForProduct(slug);
  const otherProducts = PRODUCTS.filter((p) => p.slug !== product.slug);
  const crossSellItems: CrossSellItem[] =
    otherProducts.length > 0
      ? Array.from({ length: CROSS_SELL_CAROUSEL_SLOTS }, (_, i) => {
          const p = otherProducts[i % otherProducts.length]!;
          return { product: p, key: `${p.slug}-${i}` };
        })
      : [];

  return (
    <div className="flex min-h-full flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-black/10 bg-black/5 px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center gap-2 text-sm text-black/70">
            <Link href="/shop" className="hover:text-black">
              Shop
            </Link>
            <span aria-hidden>/</span>
            <span className="font-medium text-black">{product.name}</span>
          </div>
        </div>

        {slug === "testosterone-booster-plus" ? (
          <div className="border-b border-black/10 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-6xl">
              <DismissiblePromoGif variant="inline" />
            </div>
          </div>
        ) : null}

        <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
            <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-black bg-black/5 lg:sticky lg:top-24">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-accent-outlined">
                {product.subtitle}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                {product.name}
              </h1>
              {product.brand ? (
                <p className="mt-2 text-black/55">{product.brand}</p>
              ) : null}
              <p className="mt-4 text-lg font-medium text-black">
                {product.tagline}
              </p>
              <p className="mt-4 text-black/75">{product.detailIntro}</p>

              <ul className="mt-8 space-y-2 border-l-4 border-[#c9fa49] pl-4">
                {product.specs.map((line) => (
                  <li key={line} className="text-sm text-black/80">
                    {line}
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-black">
                Why people choose this
              </h2>
              <ul className="mt-4 space-y-6">
                {product.benefits.map((b) => (
                  <li key={b.title}>
                    <p className="font-semibold text-black">{b.title}</p>
                    <p className="mt-1 text-sm text-black/70">{b.description}</p>
                  </li>
                ))}
              </ul>

              <div
                id="order-product"
                className="mt-10 flex scroll-mt-28 flex-col gap-4 sm:flex-row sm:items-center"
              >
                <ProductOrderActions
                  productSlug={product.slug}
                  productName={product.name}
                />
                <Link
                  href="/shop"
                  className="text-center text-sm font-medium text-black underline underline-offset-4 hover:text-black/70"
                >
                  ← Shop all products
                </Link>
              </div>

              <p className="mt-8 text-xs text-black/50">
                Dietary supplement — not medicine. Not intended to diagnose,
                treat, or cure. Ask your doctor if you are unsure.
              </p>
            </div>
          </div>
        </article>

        {crossSellItems.length > 0 ? (
          <section
            className="border-t border-black/10 bg-zinc-50 px-4 py-8 sm:px-6 sm:py-10"
            aria-labelledby="other-products-heading"
          >
            <div className="mx-auto max-w-6xl">
              <h2
                id="other-products-heading"
                className="text-lg font-semibold text-black sm:text-xl"
              >
                Other products shoppers grab
              </h2>
              <div className="-mx-4 sm:-mx-6">
                <OtherProductsCarousel items={crossSellItems} />
              </div>
            </div>
          </section>
        ) : null}

        <ReviewsSection
          title={`Reviews · ${product.name}`}
          reviews={productReviews}
          reviewProductName={product.name}
          summaryLabel={
            productReviews.length === 0
              ? "No reviews yet — be the first."
              : `${productReviews.length} reviews · ${product.name}`
          }
        />
      </main>
      <SiteFooter />
    </div>
  );
}
