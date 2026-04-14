import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-black"
        >
          Thruxta<span className="text-accent-outlined"> Vitals</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium sm:gap-6">
          <Link
            href="/"
            className="text-black/80 transition-colors hover:text-black"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="rounded-full bg-black px-4 py-2 text-white transition-colors hover:bg-black/90"
          >
            Shop
          </Link>
        </nav>
      </div>
    </header>
  );
}
