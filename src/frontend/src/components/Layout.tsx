import { BlackGlassButton } from "@/components/BlackGlassButton";
import { PrismDivider } from "@/components/PrismDivider";
import { VusdWalletBadge } from "@/components/VusdWalletBadge";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Calendar, Clock, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const AGENDAPRO_URL = "https://agendapro.com";

const NAV_LINKS = [
  { label: "Inicio", to: "/", ocid: "nav.inicio" },
  { label: "Servicios", to: "/#servicios", ocid: "nav.servicios" },
  {
    label: "Todos los Servicios",
    to: "/servicios",
    ocid: "nav.todos_servicios",
  },
  { label: "Equipo", to: "/#equipo", ocid: "nav.equipo" },
  { label: "Únete", to: "/unete", ocid: "nav.unete" },
  { label: "Contacto", to: "/#contacto", ocid: "nav.contacto" },
];

function PrismLogoMark() {
  // Cute prism decorative detail next to the logo — iridescent sparkle.
  return (
    <span className="relative inline-flex size-7 items-center justify-center">
      <span
        aria-hidden
        className="absolute inset-0 rotate-45 rounded-[6px] bg-[length:200%_100%] animate-prism-shimmer"
        style={{ backgroundImage: "var(--gradient-prism)" }}
      />
      <span
        aria-hidden
        className="absolute inset-[3px] rotate-45 rounded-[4px] bg-card/80 backdrop-blur-sm"
      />
      <span
        aria-hidden
        className="relative size-1.5 rounded-full bg-prism-rose animate-prism-pulse"
      />
    </span>
  );
}

function NavLink({
  label,
  to,
  ocid,
  onClick,
}: {
  label: string;
  to: string;
  ocid: string;
  onClick?: () => void;
}) {
  // Hash links scroll to section on the home page.
  const isHash = to.includes("#");
  const sectionId = isHash ? to.split("#")[1] : null;
  const basePath = isHash ? to.split("#")[0] : to;

  return (
    <Link
      to={basePath || "/"}
      hash={sectionId || undefined}
      onClick={onClick}
      data-ocid={ocid}
      className="group relative font-body text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
      activeProps={{ className: "text-foreground" }}
    >
      <span>{label}</span>
      {/* Animated iridescent underline on hover */}
      <span
        aria-hidden
        className="absolute -bottom-1 left-0 h-px w-0 bg-[length:200%_100%] transition-all duration-300 group-hover:w-full"
        style={{ backgroundImage: "var(--gradient-prism)" }}
      />
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card/85 shadow-subtle backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="nav.logo"
          className="group flex items-center gap-2.5"
        >
          <PrismLogoMark />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg text-foreground">Liza</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
              Espacio Belleza
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.ocid} {...l} />
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <VusdWalletBadge />
          <BlackGlassButton size="sm" asChild data-ocid="nav.agendar_button">
            <a href={AGENDAPRO_URL} target="_blank" rel="noopener noreferrer">
              <Calendar className="size-3.5" />
              Agenda tu Hora
            </a>
          </BlackGlassButton>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          data-ocid="nav.mobile_toggle"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-smooth hover:bg-muted lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-card/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.ocid} {...l} onClick={() => setOpen(false)} />
            ))}
            <div className="mt-3 flex flex-col gap-2.5">
              <VusdWalletBadge className="w-full justify-center" />
              <BlackGlassButton
                size="default"
                asChild
                className="w-full"
                data-ocid="nav.mobile_agendar_button"
              >
                <a
                  href={AGENDAPRO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  <Calendar className="size-4" />
                  Agenda tu Hora
                </a>
              </BlackGlassButton>
            </div>
          </div>
        </div>
      )}
      {/* Subtle prism line under navbar */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-px bg-[length:200%_100%] animate-prism-shimmer",
          location.pathname === "/" ? "opacity-60" : "opacity-30",
        )}
        style={{ backgroundImage: "var(--gradient-prism)" }}
      />
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      id="contacto"
      className="border-t border-border bg-muted/40"
      data-ocid="footer.section"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <PrismLogoMark />
              <span className="font-display text-lg text-foreground">
                Liza Espacio Belleza
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Estudio de belleza en Providencia, Santiago de Chile. Cuidamos tu
              piel, tu cuerpo y tu confianza.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-prism-violet/30 bg-accent/10 px-3 py-1 font-mono text-xs text-prism-violet">
              <span className="size-1.5 animate-prism-pulse rounded-full bg-prism-rose" />
              Desde 2019
            </span>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base text-foreground">Contacto</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-prism-rose" />
                <span>
                  Metro Los Leones, Av. Providencia 2251 Local 91 (segundo piso
                  por escaleras) — Edificio Giratorio, Providencia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-prism-violet" />
                <a
                  href="mailto:contacto@lizaespaciobelleza.cl"
                  data-ocid="footer.email_link"
                  className="transition-colors hover:text-foreground"
                >
                  contacto@lizaespaciobelleza.cl
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-prism-cyan" />
                <a
                  href="tel:+56981872620"
                  data-ocid="footer.phone_link"
                  className="transition-colors hover:text-foreground"
                >
                  +56 9 8187 2620
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-base text-foreground">Horario</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Clock className="size-4 shrink-0 text-prism-gold" />
                <span>Lunes a Viernes · 10:00 — 20:00</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-4 shrink-0 text-prism-gold" />
                <span>Sábado · 10:00 — 18:00</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-4 shrink-0 text-muted-foreground" />
                <span>Domingo · Cerrado</span>
              </li>
            </ul>
            <div className="mt-5">
              <BlackGlassButton
                size="sm"
                asChild
                data-ocid="footer.agendar_button"
              >
                <a
                  href={AGENDAPRO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="size-3.5" />
                  Agenda tu Hora
                </a>
              </BlackGlassButton>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <PrismDivider />
          <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="font-mono text-xs text-muted-foreground">
              © {year} Liza Espacio Belleza · Desde 2019
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Construido con amor usando{" "}
              <a
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.caffeine_link"
                className="text-prism-violet transition-colors hover:text-foreground"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
