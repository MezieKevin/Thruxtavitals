import Link from "next/link";
import { PHONE_DISPLAY, WHATSAPP_WA } from "@/lib/contact";

const PHONE_TEL = "+2347084706535";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      className="border-t border-black/10 bg-black text-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
          <div>
            <p className="text-lg font-semibold">
              Thruxta<span className="text-accent-outlined">Vitals</span>
            </p>
            <p className="mt-3 max-w-md text-sm text-white/65">
              CoQ10 & men's vitality. Order online, pay on delivery, chat us on
              WhatsApp.
            </p>
            <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/80">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/shop" className="hover:text-white">
                Shop
              </Link>
              <Link href="/shop" className="hover:text-white">
                Shop
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-outlined">
              Contact
            </p>
            <p className="mt-2 text-xs text-white/50">
              Call or text: 9am–6pm · WhatsApp: 24/7
            </p>
            <p className="mt-4 text-sm text-white/85">
              <span className="text-white/55">Phone · </span>
              <a
                href={`tel:${PHONE_TEL}`}
                className="font-medium text-white underline decoration-white/30 underline-offset-2 hover:decoration-white"
              >
                {PHONE_DISPLAY}
              </a>
            </p>
            <p className="mt-3">
              <a
                href={`https://wa.me/${WHATSAPP_WA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                <span>WhatsApp {PHONE_DISPLAY}</span>
              </a>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85">
              <span className="text-white/55">Address · </span>
              No 14 Oyeyinka Williams Street, Ejigbo, Lagos
            </p>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-8 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Thruxta Vitals. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
