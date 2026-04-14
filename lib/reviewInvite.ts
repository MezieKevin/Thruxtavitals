import { WHATSAPP_WA } from "@/lib/contact";

export function reviewWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_WA}?text=${encodeURIComponent(message)}`;
}

export function buildSubmittedReviewWhatsAppMessage(opts: {
  name: string;
  rating: number;
  review: string;
  productLabel?: string;
}): string {
  const lines = [
    "Hi Thruxta Vitals — my review:",
    opts.productLabel ? `Product: ${opts.productLabel}` : null,
    `Name: ${opts.name.trim()}`,
    `Rating: ${opts.rating} / 5`,
    "",
    opts.review.trim(),
  ].filter((x): x is string => Boolean(x));
  return lines.join("\n");
}
