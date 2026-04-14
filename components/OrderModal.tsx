"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRegisterModalOpen } from "@/components/ModalOverlayContext";
import { WHATSAPP_WA } from "@/lib/contact";
import { NIGERIAN_STATES } from "@/lib/ngStates";
import { formatNgn, unitPriceNgn } from "@/lib/orderPricing";
import { PRODUCTS, getProductBySlug } from "@/lib/products";

type Step = "shipping" | "payment" | "complete";

type CartLine = {
  slug: string;
  included: boolean;
  quantity: number;
};

type OrderSnapshot = {
  lines: { slug: string; name: string; qty: number; lineTotalNgn: number }[];
  totalNgn: number;
};

function buildInitialCart(primarySlug: string): CartLine[] {
  const sorted = [...PRODUCTS].sort((a, b) => {
    if (a.slug === primarySlug) return -1;
    if (b.slug === primarySlug) return 1;
    return 0;
  });
  return sorted.map((p) => ({
    slug: p.slug,
    included: p.slug === primarySlug,
    quantity: 1,
  }));
}

function buildOrderSnapshotFromCart(cart: CartLine[]): OrderSnapshot | null {
  const lines = cart
    .filter((l) => l.included && l.quantity >= 1)
    .map((l) => {
      const p = getProductBySlug(l.slug);
      const unit = unitPriceNgn(l.slug);
      return {
        slug: l.slug,
        name: p?.name ?? l.slug,
        qty: l.quantity,
        lineTotalNgn: unit * l.quantity,
      };
    });
  const totalNgn = lines.reduce((s, x) => s + x.lineTotalNgn, 0);
  if (lines.length === 0 || totalNgn <= 0) return null;
  return { lines, totalNgn };
}

export type OrderModalProps = {
  productSlug: string;
  productName: string;
  open: boolean;
  onClose: () => void;
};

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  state: string;
  lga: string;
  town: string;
  busStop: string;
  street: string;
  shipDifferent: boolean;
  altAddress: string;
  orderNotes: string;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  state: "",
  lga: "",
  town: "",
  busStop: "",
  street: "",
  shipDifferent: false,
  altAddress: "",
  orderNotes: "",
};

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_WA}?text=${encodeURIComponent(message)}`;
}

const WHATSAPP_REDIRECT_SECONDS = 5;

export function OrderModal({
  productSlug,
  productName,
  open,
  onClose,
}: OrderModalProps) {
  useRegisterModalOpen(open);

  const titleId = useId();
  const [step, setStep] = useState<Step>("shipping");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [cartLines, setCartLines] = useState<CartLine[]>(() =>
    buildInitialCart(productSlug),
  );
  const cartLinesRef = useRef(cartLines);
  cartLinesRef.current = cartLines;
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [completedAt, setCompletedAt] = useState<Date | null>(null);
  const [orderSnapshot, setOrderSnapshot] = useState<OrderSnapshot | null>(null);
  const [redirectSeconds, setRedirectSeconds] = useState(WHATSAPP_REDIRECT_SECONDS);
  const [confirmWant, setConfirmWant] = useState(true);

  const cartTotals = useMemo(() => {
    let subtotal = 0;
    const rows: {
      slug: string;
      name: string;
      unitNgn: number;
      qty: number;
      lineTotalNgn: number;
      included: boolean;
      isPrimary: boolean;
    }[] = [];
    for (const line of cartLines) {
      const p = getProductBySlug(line.slug);
      const unit = unitPriceNgn(line.slug);
      const lineTotal = line.included ? unit * line.quantity : 0;
      if (line.included) subtotal += lineTotal;
      rows.push({
        slug: line.slug,
        name: p?.name ?? line.slug,
        unitNgn: unit,
        qty: line.quantity,
        lineTotalNgn: lineTotal,
        included: line.included,
        isPrimary: line.slug === productSlug,
      });
    }
    return { rows, subtotal };
  }, [cartLines, productSlug]);

  const updateCartQty = useCallback((slug: string, qty: number) => {
    const q = Math.max(1, Math.min(99, Math.floor(qty) || 1));
    setCartLines((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, quantity: q } : l)),
    );
  }, []);

  const toggleCartLine = useCallback(
    (slug: string) => {
      if (slug === productSlug) return;
      setCartLines((prev) =>
        prev.map((l) =>
          l.slug === slug ? { ...l, included: !l.included } : l,
        ),
      );
    },
    [productSlug],
  );

  const setField = useCallback(
    (key: keyof FormState, value: string | boolean) => {
      setForm((f) => ({ ...f, [key]: value }));
      setFieldErrors((e) => ({ ...e, [key]: undefined }));
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setStep("shipping");
      setForm(emptyForm);
      setFieldErrors({});
      setCartLines(buildInitialCart(productSlug));
      setOrderNumber("");
      setCompletedAt(null);
      setOrderSnapshot(null);
      setRedirectSeconds(WHATSAPP_REDIRECT_SECONDS);
      setConfirmWant(true);
      return;
    }
    setCartLines(buildInitialCart(productSlug));
  }, [open, productSlug]);

  const validateShipping = (): boolean => {
    const req: (keyof FormState)[] = [
      "firstName",
      "lastName",
      "phone",
      "email",
      "state",
      "town",
      "street",
    ];
    const next: Partial<Record<keyof FormState, string>> = {};
    for (const k of req) {
      const v = String(form[k]).trim();
      if (!v) next[k] = `${String(k)} is required`;
    }
    if (form.shipDifferent && !form.altAddress.trim()) {
      next.altAddress = "Alternate address is required";
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const goPayment = () => {
    if (!validateShipping()) return;
    setStep("payment");
  };

  const submitOrder = async () => {
    const snapshotForPayload = buildOrderSnapshotFromCart(cartLinesRef.current);
    if (!snapshotForPayload) return;

    setSubmitting(true);
    const payload = {
      primaryProductSlug: productSlug,
      primaryProductName: productName,
      lines: snapshotForPayload.lines,
      totalNgn: snapshotForPayload.totalNgn,
      form,
      submittedAt: new Date().toISOString(),
    };
    try {
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* still advance UX; sheet hook can retry later */
    }

    const finalSnapshot = buildOrderSnapshotFromCart(cartLinesRef.current);
    if (!finalSnapshot) {
      setSubmitting(false);
      return;
    }

    const num = String(Math.floor(1000 + Math.random() * 9000));
    setOrderNumber(num);
    setCompletedAt(new Date());
    setOrderSnapshot(finalSnapshot);
    setStep("complete");
    setRedirectSeconds(WHATSAPP_REDIRECT_SECONDS);
    setSubmitting(false);
  };

  const whatsappMessage = useMemo(() => {
    if (!orderSnapshot || !orderNumber) return "";
    const linesText = orderSnapshot.lines
      .map((l) => `• ${l.name} × ${l.qty} = ${formatNgn(l.lineTotalNgn)}`)
      .join("\n");
    return (
      `Hi Thruxta — new order #${orderNumber}\n` +
      `${linesText}\n` +
      `Total: ${formatNgn(orderSnapshot.totalNgn)}\n` +
      `Name: ${form.firstName} ${form.lastName}\n` +
      `Phone/WhatsApp: ${form.phone}\n` +
      `Please confirm on WhatsApp. Thanks!`
    );
  }, [orderSnapshot, orderNumber, form]);

  const whatsappUrl = useMemo(
    () => (whatsappMessage ? buildWhatsAppUrl(whatsappMessage) : ""),
    [whatsappMessage],
  );

  useEffect(() => {
    if (step !== "complete" || !whatsappUrl) return;
    setRedirectSeconds(WHATSAPP_REDIRECT_SECONDS);
    let s = WHATSAPP_REDIRECT_SECONDS;
    const id = window.setInterval(() => {
      s -= 1;
      setRedirectSeconds(s);
      if (s <= 0) {
        window.clearInterval(id);
        window.location.href = whatsappUrl;
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [step, whatsappUrl]);

  if (!open) return null;

  const inputClass =
    "mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-black outline-none ring-[#c9fa49] focus:ring-2";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close checkout"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-2 border-black bg-white shadow-xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-black/10 bg-zinc-50 px-4 py-4 sm:px-6">
          <div className="min-w-0 pr-2">
            <h2 id={titleId} className="text-lg font-bold text-neutral-900 sm:text-xl">
              {step === "complete"
                ? "You're almost done"
                : "Finish your order"}
            </h2>
            {step !== "complete" ? (
              <p className="mt-1 text-xs text-black/60 sm:text-sm">
                Pay on delivery — quick form, we confirm on WhatsApp.
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-black/15 px-3 py-1.5 text-sm font-medium text-black hover:bg-black/5"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {step !== "complete" ? (
            <p className="mb-4 text-center text-xs font-bold text-black/80 sm:text-sm">
              <span className="text-[#d4af37] drop-shadow-sm">4.9★</span> average
              from buyers this year
            </p>
          ) : null}

          {step !== "complete" ? (
            <div className="mb-6 flex justify-center gap-2 text-xs font-semibold sm:text-sm">
              <span
                className={`rounded-full px-3 py-1 ${
                  step === "shipping"
                    ? "bg-[#c9fa49] text-black"
                    : "bg-black/10 text-black/60"
                }`}
              >
                1 · Delivery details
              </span>
              <span className="text-black/30">→</span>
              <span
                className={`rounded-full px-3 py-1 ${
                  step === "payment"
                    ? "bg-[#c9fa49] text-black"
                    : "bg-black/10 text-black/60"
                }`}
              >
                2 · Pay on delivery
              </span>
            </div>
          ) : null}

          {step === "shipping" ? (
            <div className="space-y-4">
              <p className="text-center text-sm font-semibold text-black">
                We&apos;re sending {productName} to you — where should we deliver?
              </p>
              <p
                className="mx-auto max-w-md rounded-xl border-2 border-black bg-[#c9fa49]/40 px-4 py-3 text-center text-base font-bold leading-snug text-black shadow-sm sm:text-lg"
                role="status"
              >
                Delivery address
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-black">
                  First name
                  <input
                    value={form.firstName}
                    onChange={(e) => setField("firstName", e.target.value)}
                    className={inputClass}
                    autoComplete="given-name"
                  />
                  {fieldErrors.firstName ? (
                    <span className="mt-1 block text-xs text-red-600">
                      First name is required
                    </span>
                  ) : null}
                </label>
                <label className="block text-sm font-medium text-black">
                  Last name
                  <input
                    value={form.lastName}
                    onChange={(e) => setField("lastName", e.target.value)}
                    className={inputClass}
                    autoComplete="family-name"
                  />
                  {fieldErrors.lastName ? (
                    <span className="mt-1 block text-xs text-red-600">
                      Last name is required
                    </span>
                  ) : null}
                </label>
              </div>

              <label className="block text-sm font-medium text-black">
                Phone / WhatsApp{" "}
                <span className="font-normal text-black/55">
                  (one number is fine)
                </span>
                <input
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  type="tel"
                  className={inputClass}
                  autoComplete="tel"
                />
                {fieldErrors.phone ? (
                  <span className="mt-1 block text-xs text-red-600">
                    Phone number is required
                  </span>
                ) : null}
              </label>

              <label className="block text-sm font-medium text-black">
                Email
                <span className="mt-0.5 block text-xs font-normal text-black/50">
                  For your order confirmation
                </span>
                <input
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  type="email"
                  className={inputClass}
                  autoComplete="email"
                />
                {fieldErrors.email ? (
                  <span className="mt-1 block text-xs text-red-600">
                    Email is required
                  </span>
                ) : null}
              </label>

              <label className="block text-sm font-medium text-black">
                State
                <select
                  value={form.state}
                  onChange={(e) => setField("state", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {fieldErrors.state ? (
                  <span className="mt-1 block text-xs text-red-600">
                    State is required
                  </span>
                ) : null}
              </label>

              <label className="block text-sm font-medium text-black">
                Town / City
                <input
                  value={form.town}
                  onChange={(e) => setField("town", e.target.value)}
                  className={inputClass}
                />
                {fieldErrors.town ? (
                  <span className="mt-1 block text-xs text-red-600">
                    Town / City is required
                  </span>
                ) : null}
              </label>

              <label className="block text-sm font-medium text-black">
                Local Government Area{" "}
                <span className="font-normal text-black/55">(optional)</span>
                <input
                  value={form.lga}
                  onChange={(e) => setField("lga", e.target.value)}
                  placeholder="L.G.A"
                  className={inputClass}
                />
              </label>

              <label className="block text-sm font-medium text-black">
                Nearest bus stop{" "}
                <span className="font-normal text-black/55">(optional)</span>
                <input
                  value={form.busStop}
                  onChange={(e) => setField("busStop", e.target.value)}
                  placeholder="Nearest bus stop"
                  className={inputClass}
                />
              </label>

              <label className="block text-sm font-medium text-black">
                Street address
                <input
                  value={form.street}
                  onChange={(e) => setField("street", e.target.value)}
                  placeholder="House number and street name"
                  className={inputClass}
                />
                {fieldErrors.street ? (
                  <span className="mt-1 block text-xs text-red-600">
                    Street address is required
                  </span>
                ) : null}
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-black">
                <input
                  type="checkbox"
                  checked={form.shipDifferent}
                  onChange={(e) => setField("shipDifferent", e.target.checked)}
                  className="h-4 w-4 rounded border-black/30"
                />
                Ship to a different address?
              </label>

              {form.shipDifferent ? (
                <label className="block text-sm font-medium text-black">
                  Alternate shipping address
                  <textarea
                    value={form.altAddress}
                    onChange={(e) => setField("altAddress", e.target.value)}
                    rows={3}
                    className={inputClass}
                  />
                  {fieldErrors.altAddress ? (
                    <span className="mt-1 block text-xs text-red-600">
                      {fieldErrors.altAddress}
                    </span>
                  ) : null}
                </label>
              ) : null}

              <label className="block text-sm font-medium text-black">
                Order notes (optional)
                <textarea
                  value={form.orderNotes}
                  onChange={(e) => setField("orderNotes", e.target.value)}
                  rows={2}
                  className={inputClass}
                />
              </label>

              <button
                type="button"
                onClick={goPayment}
                className="w-full rounded-full bg-black py-3 text-sm font-semibold text-white hover:bg-black/90"
              >
                Continue — review & pay on delivery
              </button>
            </div>
          ) : null}

          {step === "payment" ? (
            <div className="space-y-5">
              <p className="text-center text-sm font-semibold text-black">
                Your cart — pay cash or transfer when it arrives
              </p>

              <div className="overflow-x-auto rounded-xl border border-black/15">
                <table className="w-full min-w-[320px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-black/10 bg-zinc-50">
                      <th className="px-2 py-2 font-semibold sm:px-3">Include</th>
                      <th className="px-2 py-2 font-semibold sm:px-3">Product</th>
                      <th className="px-2 py-2 font-semibold sm:px-3">Qty</th>
                      <th className="hidden px-2 py-2 text-right font-semibold sm:table-cell sm:px-3">
                        Unit
                      </th>
                      <th className="px-2 py-2 text-right font-semibold sm:px-3">
                        Line total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartTotals.rows.map((row) => {
                      const line = cartLines.find((l) => l.slug === row.slug)!;
                      return (
                        <tr
                          key={row.slug}
                          className={`border-b border-black/5 last:border-0 ${
                            row.isPrimary ? "bg-[#c9fa49]/15" : ""
                          }`}
                        >
                          <td className="px-2 py-3 align-top sm:px-3">
                            <input
                              type="checkbox"
                              checked={line.included}
                              disabled={row.isPrimary || submitting}
                              onChange={() => toggleCartLine(row.slug)}
                              className="mt-1 h-4 w-4 rounded border-black/30 disabled:opacity-60"
                              title={
                                row.isPrimary
                                  ? "This item stays in your order"
                                  : undefined
                              }
                              aria-label={`Include ${row.name}`}
                            />
                          </td>
                          <td className="px-2 py-3 align-top sm:px-3">
                            <span className="font-medium text-black">
                              {row.name}
                            </span>
                            {row.isPrimary ? (
                              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-black/50">
                                Started from this page
                              </span>
                            ) : null}
                          </td>
                          <td className="px-2 py-3 align-top sm:px-3">
                            <input
                              type="number"
                              min={1}
                              max={99}
                              value={line.quantity}
                              disabled={!line.included || submitting}
                              onChange={(e) =>
                                updateCartQty(row.slug, Number(e.target.value))
                              }
                              className="w-16 rounded-lg border border-black/20 px-2 py-1 text-center text-black disabled:bg-black/5"
                            />
                          </td>
                          <td className="hidden px-2 py-3 text-right align-top text-black/70 sm:table-cell sm:px-3">
                            {line.included ? formatNgn(row.unitNgn) : "—"}
                          </td>
                          <td className="px-2 py-3 text-right align-top font-semibold text-black sm:px-3">
                            {line.included ? formatNgn(row.lineTotalNgn) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between rounded-xl border-2 border-black bg-zinc-50 px-4 py-3">
                <span className="text-sm font-bold text-black">Order total</span>
                <span className="text-lg font-bold text-black">
                  {formatNgn(cartTotals.subtotal)}
                </span>
              </div>

              <p className="mx-auto max-w-md text-center text-sm font-bold leading-relaxed text-black sm:text-base">
                Want a bundle deal? WhatsApp us after you submit — we&apos;ll sort
                it out.
              </p>

              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/15 bg-zinc-50 p-3 text-sm font-medium text-black">
                <input
                  type="checkbox"
                  checked={confirmWant}
                  onChange={(e) => setConfirmWant(e.target.checked)}
                  className="h-4 w-4"
                />
                I confirm these products and quantities — bill me on delivery.
              </label>

              <div className="rounded-xl border border-black/10 bg-zinc-50 p-4 text-xs leading-relaxed text-black/80">
                <p className="font-bold text-black">
                  Our promise to you
                </p>
                <p className="mt-2">
                  Real specs, careful sourcing, labels you can trust. If something
                  isn&apos;t right, talk to us — we want you coming back.
                </p>
              </div>

              <button
                type="button"
                disabled={
                  submitting ||
                  !confirmWant ||
                  cartTotals.subtotal <= 0
                }
                onClick={submitOrder}
                className="w-full rounded-full bg-[#c9fa49] py-3 text-sm font-semibold text-black hover:brightness-95 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Submit my order"}
              </button>
            </div>
          ) : null}

          {step === "complete" && completedAt && orderSnapshot ? (
            <div className="space-y-5 text-sm text-black/80">
              <p className="text-center text-lg font-bold text-black">
                Here&apos;s your summary
              </p>
              <div className="text-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-md hover:brightness-95"
                >
                  Confirm on WhatsApp now
                </a>
              </div>
              <p className="text-center text-xs text-black/60">
                Opening WhatsApp in{" "}
                <span className="font-semibold text-black">{redirectSeconds}s</span>{" "}
                — or tap the green button now.
              </p>

              <p className="text-center font-medium text-black">
                Got it — we have your request.
              </p>

              <ul className="mx-auto max-w-md space-y-2 rounded-xl border border-black/10 bg-zinc-50 p-4 text-sm">
                <li className="flex justify-between gap-4">
                  <span className="text-black/60">Order number</span>
                  <span className="font-semibold text-black">{orderNumber}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-black/60">Date</span>
                  <span className="font-medium text-black">
                    {completedAt.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-black/60">Total</span>
                  <span className="font-semibold text-black">
                    {formatNgn(orderSnapshot.totalNgn)}
                  </span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-black/60">Payment method</span>
                  <span className="text-right font-medium text-black">
                    Cash / Bank Transfer on delivery
                  </span>
                </li>
              </ul>

              <div className="rounded-xl border border-black/10 bg-amber-50/80 p-4 text-xs leading-relaxed text-black/85">
                <strong>Pay on delivery</strong> — cash or bank transfer when your
                rider arrives. Have payment ready so we can keep deliveries fast for
                everyone.
              </div>

              <div>
                <p className="mb-2 font-semibold text-black">Order details</p>
                <div className="overflow-x-auto rounded-lg border border-black/15">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-black/10 bg-zinc-100">
                        <th className="px-3 py-2">Product</th>
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderSnapshot.lines.map((l) => (
                        <tr key={l.slug} className="border-b border-black/5">
                          <td className="px-3 py-2">
                            {l.name} × {l.qty}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {formatNgn(l.lineTotalNgn)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 space-y-1 border-t border-black/10 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatNgn(orderSnapshot.totalNgn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment method</span>
                    <span className="text-right">Cash / Bank Transfer on delivery</span>
                  </div>
                  <div className="flex justify-between font-semibold text-black">
                    <span>Total</span>
                    <span>{formatNgn(orderSnapshot.totalNgn)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full border-2 border-black py-3 text-sm font-semibold text-black hover:bg-black/5"
              >
                Close
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
