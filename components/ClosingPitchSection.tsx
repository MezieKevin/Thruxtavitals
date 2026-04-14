export function ClosingPitchSection() {
  return (
    <section className="border-t border-black/10 bg-[#c9fa49]/10 px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-semibold text-black sm:text-3xl">
          Simple choices. Straight answers.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-black/70">
          Two products only — CoQ10 for heart and energy, and a men's blend with
          shilajit and ashwagandha. You always see dose, count, and how to use it.
        </p>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {[
            "CoQ10 for heart support and daily energy; herbal blend for drive, stamina, and focus.",
            "Every page shows mg per capsule, how many pills, and servings — check before you buy.",
            "No buzzwords — just supplements that match how you actually live.",
            "Short checkout, then we WhatsApp you to lock in delivery and pay-on-delivery.",
          ].map((line) => (
            <li
              key={line}
              className="flex gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black/80"
            >
              <span
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#c9fa49]"
                aria-hidden
              />
              {line}
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-black/50">
          Labels match what's in the bottle. Supplements are not medicine — read
          the label and ask your doctor if you have questions.
        </p>
      </div>
    </section>
  );
}
