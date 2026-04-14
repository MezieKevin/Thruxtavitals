import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

function badgeFor(slug: string): { text: string; className: string } {
  if (slug === "coq10") {
    return { text: "HEART HEALTH", className: "bg-red-600 text-white" };
  }
  return { text: "VITALITY", className: "bg-red-600 text-white" };
}

export function ProductShopCard({
  product,
  anchorId,
  variant = "default",
  listClassName,
}: {
  product: Product;
  anchorId?: string;
  /** Narrow card for horizontal scroll rows (e.g. product page cross-sell). */
  variant?: "default" | "carousel";
  /** Extra classes on the root `li` (e.g. responsive flex-basis for carousels). */
  listClassName?: string;
}) {
  const badge = badgeFor(product.slug);
  const href = `/order/${product.slug}`;
  const carousel = variant === "carousel";
  const liCarouselFixed =
    carousel && !listClassName
      ? "w-[min(17.5rem,calc(100vw-2.5rem))] sm:w-[18.75rem]"
      : "";

  return (
    <li
      id={anchorId}
      className={[
        carousel
          ? "shrink-0 snap-start scroll-mt-28 flex flex-col overflow-hidden rounded-xl border-2 border-black bg-white shadow-sm"
          : "scroll-mt-28 flex flex-col overflow-hidden rounded-2xl border-2 border-black bg-white shadow-sm",
        liCarouselFixed,
        listClassName ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link href={href} className="group relative aspect-[4/3] bg-black/5">
        <span
          className={`absolute left-3 top-3 z-10 rounded-full font-bold uppercase tracking-wide text-white sm:left-4 sm:top-4 ${
            carousel
              ? "px-2 py-0.5 text-[9px] sm:text-[10px]"
              : "px-2.5 py-1 text-[10px]"
          } ${badge.className}`}
        >
          {badge.text}
        </span>
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-cover transition group-hover:opacity-95"
          sizes={
            carousel
              ? listClassName
                ? "(max-width: 768px) 100vw, (max-width: 1024px) 34vw, 26vw"
                : "(max-width: 640px) min(280px, 100vw), 300px"
              : "(max-width: 640px) 100vw, 50vw"
          }
        />
      </Link>
      <div className={`flex flex-1 flex-col ${carousel ? "p-4" : "p-6"}`}>
        <h3
          className={`font-semibold text-black ${carousel ? "text-base sm:text-lg" : "text-xl"}`}
        >
          {product.name}
        </h3>
        <p
          className={`mt-1 text-accent-outlined ${carousel ? "text-xs sm:text-sm" : "text-sm"}`}
        >
          {product.subtitle}
        </p>
        {product.brand ? (
          <p
            className={`mt-1.5 text-black/55 ${carousel ? "text-xs" : "text-sm"}`}
          >
            {product.brand}
          </p>
        ) : null}
        <p
          className={`mt-2 flex-1 text-black/70 ${carousel ? "line-clamp-2 text-xs sm:text-sm" : "text-sm"}`}
        >
          {product.specs[0]}
        </p>
        <Link
          href={href}
          className={`inline-flex w-full items-center justify-center rounded-full border-2 border-black font-semibold text-black transition hover:bg-black hover:text-white ${
            carousel
              ? "mt-3 py-2 text-xs sm:mt-4 sm:py-2.5 sm:text-sm"
              : "mt-6 py-3 text-sm"
          }`}
        >
          View product & order
        </Link>
      </div>
    </li>
  );
}
