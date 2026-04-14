"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { useRegisterModalOpen } from "@/components/ModalOverlayContext";
import {
  buildSubmittedReviewWhatsAppMessage,
  reviewWhatsAppUrl,
} from "@/lib/reviewInvite";

type AddReviewEntryProps = {
  /** When set (e.g. on a product page), included in the WhatsApp message. */
  reviewProductName?: string;
};

function StarRatingInput({
  value,
  onChange,
  idPrefix,
}: {
  value: number;
  onChange: (n: number) => void;
  idPrefix: string;
}) {
  return (
    <div
      role="group"
      aria-labelledby={`${idPrefix}-rating-label`}
      aria-describedby={`${idPrefix}-rating-value`}
      className="flex flex-wrap gap-0.5"
    >
      <span id={`${idPrefix}-rating-value`} className="sr-only">
        {value > 0
          ? `Current rating: ${value} out of 5 stars`
          : "No rating selected yet"}
      </span>
      {[1, 2, 3, 4, 5].map((n) => {
        const selected = n <= value;
        return (
          <button
            key={n}
            type="button"
            aria-label={`Set rating to ${n} out of 5 stars`}
            className={`rounded px-0.5 text-3xl leading-none transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#c9fa49] ${
              selected ? "text-[#d4af37]" : "text-black/20"
            }`}
            onClick={() => onChange(n)}
          >
            {"\u2605"}
          </button>
        );
      })}
    </div>
  );
}

function AddReviewModal({
  open,
  onClose,
  productLabel,
}: {
  open: boolean;
  onClose: () => void;
  productLabel?: string;
}) {
  useRegisterModalOpen(open);

  const titleId = useId();
  const ratingGroupId = useId();
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<{
    name?: string;
    review?: string;
    rating?: string;
  }>({});

  useEffect(() => {
    if (!open) return;
    setName("");
    setReview("");
    setRating(0);
    setErrors({});
  }, [open]);

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

  const validate = useCallback(() => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (rating < 1 || rating > 5) next.rating = "Tap a star rating from 1 to 5.";
    const body = review.trim();
    if (body.length < 8) next.review = "Please write a few words (at least 8 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [name, rating, review]);

  const submit = useCallback(() => {
    if (!validate()) return;
    const message = buildSubmittedReviewWhatsAppMessage({
      name: name.trim(),
      rating,
      review: review.trim(),
      productLabel,
    });
    window.open(reviewWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    onClose();
  }, [validate, name, rating, review, productLabel, onClose]);

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
        aria-label="Close review form"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border-2 border-black bg-white shadow-xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-black/10 bg-zinc-50 px-4 py-4 sm:px-6">
          <div className="min-w-0 pr-2">
            <h2 id={titleId} className="text-lg font-bold text-neutral-900 sm:text-xl">
              Leave a review
            </h2>
            <p className="mt-1 text-xs text-black/60 sm:text-sm">
              Tap send — we open WhatsApp with your review ready to go.
            </p>
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
          <div className="space-y-4">
            <label className="block text-sm font-medium text-black">
              Your name
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((x) => ({ ...x, name: undefined }));
                }}
                className={inputClass}
                autoComplete="name"
                placeholder="e.g. Chinedu O."
              />
              {errors.name ? (
                <span className="mt-1 block text-xs text-red-600">{errors.name}</span>
              ) : null}
            </label>

            <div>
              <p id={`${ratingGroupId}-rating-label`} className="text-sm font-medium text-black">
                Star rating
              </p>
              <div className="mt-2">
                <StarRatingInput
                  value={rating}
                  onChange={(n) => {
                    setRating(n);
                    setErrors((x) => ({ ...x, rating: undefined }));
                  }}
                  idPrefix={ratingGroupId}
                />
              </div>
              {errors.rating ? (
                <span className="mt-1 block text-xs text-red-600">{errors.rating}</span>
              ) : null}
            </div>

            <label className="block text-sm font-medium text-black">
              Your review
              <textarea
                value={review}
                onChange={(e) => {
                  setReview(e.target.value);
                  setErrors((x) => ({ ...x, review: undefined }));
                }}
                rows={4}
                className={inputClass}
                placeholder="Tell us what worked for you (or what didn’t)."
              />
              {errors.review ? (
                <span className="mt-1 block text-xs text-red-600">{errors.review}</span>
              ) : null}
            </label>

            <button
              type="button"
              onClick={submit}
              className="w-full rounded-full bg-[#c9fa49] py-3 text-sm font-semibold text-black hover:brightness-95"
            >
              Send on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddReviewEntry({ reviewProductName }: AddReviewEntryProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 text-left text-sm font-semibold text-black underline decoration-black/30 underline-offset-4 hover:decoration-black"
      >
        Write a review
      </button>
      <AddReviewModal
        open={open}
        onClose={() => setOpen(false)}
        productLabel={reviewProductName}
      />
    </>
  );
}
