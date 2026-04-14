import { AddReviewEntry } from "@/components/AddReviewEntry";
import { RecentOrderPulse } from "@/components/RecentOrderPulse";
import { getProductBySlug } from "@/lib/products";
import type { Review } from "@/lib/reviews";

type ReviewsSectionProps = {
  title?: string;
  reviews: Review[];
  summaryLabel?: string;
  /** Passed into the review modal / WhatsApp message on product pages. */
  reviewProductName?: string;
  /** Random “recent order” line (client-only); defaults to true. */
  showRecentOrderPulse?: boolean;
};

export function ReviewsSection({
  title = "Buyer reviews",
  reviews,
  summaryLabel,
  reviewProductName,
  showRecentOrderPulse = true,
}: ReviewsSectionProps) {
  const count = reviews.length;
  const label =
    summaryLabel ??
    (count === 0
      ? "No reviews yet — be the first."
      : `${count} reviews · 5.0★ average`);

  return (
    <section
      className="border-t border-black/10 bg-white px-4 py-16 sm:px-6 sm:py-20"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
              <h2
                id="reviews-heading"
                className="text-2xl font-semibold tracking-tight text-black sm:text-3xl"
              >
                {title}
              </h2>
              <AddReviewEntry reviewProductName={reviewProductName} />
            </div>
            <p className="mt-2 text-sm text-black/60">{label}</p>
            {showRecentOrderPulse ? <RecentOrderPulse className="mt-2" /> : null}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-black/15 bg-black/5 px-4 py-2">
            <span className="text-lg font-semibold text-black">5.0</span>
            <span
              className="text-[#d4af37] tracking-tight"
              aria-label="5 out of 5 stars"
            >
              ★★★★★
            </span>
          </div>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {reviews.map((r) => {
            const product = getProductBySlug(r.productSlug);
            return (
              <li
                key={r.id}
                className="rounded-2xl border-2 border-black/10 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-[#d4af37]"
                    aria-hidden
                  >
                    {r.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-black">
                        {r.author}
                      </span>
                      <span className="text-xs text-black/45">
                        · {r.relativeTime}
                      </span>
                    </div>
                    {product ? (
                      <p className="mt-0.5 text-xs font-semibold text-neutral-800">
                        {product.name}
                      </p>
                    ) : null}
                    <p
                      className="mt-1 text-xs text-[#d4af37] tracking-tight"
                      aria-label={`${r.rating} out of 5 stars`}
                    >
                      ★★★★★
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-black/75">
                      {r.body}
                    </p>
                    <p className="mt-3 text-xs text-black/40">
                      {r.helpful} found this helpful
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
