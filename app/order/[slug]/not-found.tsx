import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-black">Product not found</h1>
        <p className="mt-2 max-w-md text-black/65">
          That product does not exist. Browse available items in the shop.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-[#c9fa49] px-8 py-3 text-sm font-semibold text-black hover:brightness-95"
        >
          Back to shop
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
