/** Per-bottle unit price for checkout (totals = qty × unit per line, summed). */
export function unitPriceNgn(slug: string): number {
  if (slug === "coq10") return 25_000;
  if (slug === "testosterone-booster-plus") return 20_000;
  return 25_000;
}

export function formatNgn(amount: number): string {
  return `\u20A6${amount.toLocaleString("en-NG")}.00`;
}
