import { ServiceCategory } from "@/backend";
import { BlackGlassButton } from "@/components/BlackGlassButton";
import { ComboCard } from "@/components/ComboCard";
import { PrismDivider } from "@/components/PrismDivider";
import { SectionReveal, revealDelay } from "@/components/SectionReveal";
import { ServiceCard } from "@/components/ServiceCard";
import { WorkerCard } from "@/components/WorkerCard";
import {
  useCombos,
  usePartners,
  useServices,
  useTestimonials,
  useWorkers,
} from "@/hooks/useQueries";
import { SERVICE_CATEGORY_LABEL, type Service } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  Heart,
  MapPin,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";

const AGENDAPRO_URL = "https://agendapro.com";

type FilterKey = "todos" | ServiceCategory;

// Fallback partners used when the backend returns an empty list, so the banner
// always shows at least 4 partners (Flow + vUSD + 2 others).
const FALLBACK_PARTNERS = [
  {
    id: 0n,
    name: "Flow",
    description:
      "Pagos en cuotas simples y rápidas, con descuentos exclusivos para clientas del protocolo Liza.",
    logoText: "Flow",
  },
  {
    id: 1n,
    name: "Protocolo DeFi vUSD",
    description:
      "Protocolo DeFi que emite vUSD, un USD sintético estable, para pagos y reservas sin fricción.",
    logoText: "vU",
  },
  {
    id: 2n,
    name: "Descuentos Protocolo",
    description:
      "Beneficios exclusivos para profesionales y clientas dentro del protocolo Liza.",
    logoText: "Descuentos Protocolo",
  },
  {
    id: 3n,
    name: "Red Liza",
    description:
      "Red colaborativa de profesionales aliadas con beneficios cruzados y cupos compartidos.",
    logoText: "Red Liza",
  },
];

const FILTER_TABS: { key: FilterKey; label: string; ocid: string }[] = [
  { key: "todos", label: "Todos", ocid: "services.filter.todos" },
  {
    key: ServiceCategory.facial,
    label: "Faciales",
    ocid: "services.filter.facial",
  },
  {
    key: ServiceCategory.corporal,
    label: "Corporales",
    ocid: "services.filter.corporal",
  },
  {
    key: ServiceCategory.especial,
    label: "Especiales",
    ocid: "services.filter.especial",
  },
];

// ---------- Hero ----------

function Hero() {
  const scrollToServices = () => {
    document
      .getElementById("servicios")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden bg-background"
      data-ocid="hero.section"
    >
      {/* Iridescent gradient background — no photo of the local */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 10%, oklch(0.95 0.04 20 / 0.7), transparent 55%), radial-gradient(110% 80% at 90% 20%, oklch(0.93 0.05 305 / 0.55), transparent 55%), radial-gradient(100% 70% at 50% 100%, oklch(0.92 0.04 200 / 0.4), transparent 60%)",
        }}
      />
      {/* Abstract iridescent waves */}
      <svg
        aria-hidden
        role="img"
        className="pointer-events-none absolute inset-x-0 top-1/3 h-64 w-full opacity-40"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <title>Ondas iridiscentes decorativas</title>
        <defs>
          <linearGradient id="hero-wave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.72 0.18 5)" />
            <stop offset="50%" stopColor="oklch(0.7 0.16 300)" />
            <stop offset="100%" stopColor="oklch(0.78 0.13 200)" />
          </linearGradient>
        </defs>
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
          d="M0 120 Q300 40 600 100 T1200 80"
          fill="none"
          stroke="url(#hero-wave)"
          strokeWidth="1.5"
        />
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.6, delay: 0.3, ease: "easeInOut" }}
          d="M0 150 Q300 80 600 140 T1200 110"
          fill="none"
          stroke="url(#hero-wave)"
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-prism-violet/30 bg-card/60 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-prism-violet backdrop-blur-sm"
        >
          <Sparkles className="size-3.5" />
          Desde 2019 · Providencia, Santiago
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 max-w-4xl font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Tu espacio de belleza.{" "}
          <span className="text-hero-gradient">Limpiezas, masajes y más</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-5 max-w-xl font-body text-base text-muted-foreground sm:text-lg"
        >
          Desde 2019 ✨ La mejor inversión es en ti
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <BlackGlassButton size="lg" asChild data-ocid="hero.agendar_button">
            <a href={AGENDAPRO_URL} target="_blank" rel="noopener noreferrer">
              <Calendar className="size-4" />
              Agenda tu Hora
            </a>
          </BlackGlassButton>
          <button
            type="button"
            onClick={scrollToServices}
            data-ocid="hero.ver_servicios_button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card/70 px-8 font-body text-base font-medium text-foreground backdrop-blur-sm transition-smooth hover:border-prism-violet/40 hover:bg-card"
          >
            Ver Servicios
          </button>
        </motion.div>

        {/* Trust microcopy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-prism-rose" />
            Metro Los Leones, Providencia
          </span>
          <span className="hidden size-1 rounded-full bg-prism-violet sm:inline-block" />
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-prism-violet" />
            Especialidad facial y corporal
          </span>
          <span className="hidden size-1 rounded-full bg-prism-cyan sm:inline-block" />
          <span className="inline-flex items-center gap-1.5">
            <Star className="size-3.5 text-prism-gold" />
            +5 años de experiencia
          </span>
        </motion.div>
      </div>

      {/* Animated scroll-down indicator */}
      <motion.button
        type="button"
        onClick={scrollToServices}
        aria-label="Bajar a servicios"
        data-ocid="hero.scroll_indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 1, delay: 0.8 },
          y: {
            duration: 1.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
        className="absolute inset-x-0 bottom-6 mx-auto flex size-10 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground backdrop-blur-sm transition-smooth hover:text-foreground"
      >
        <ChevronDown className="size-5" />
      </motion.button>
    </section>
  );
}

// ---------- Services ----------

function ServicesSection() {
  const { data: services, isLoading } = useServices();
  const navigate = useNavigate({ from: "/" });
  const search = useSearch({ strict: false }) as { categoria?: FilterKey };
  const activeFilter: FilterKey = search.categoria ?? "todos";

  const grouped = useMemo(() => {
    const list = (services ?? []) as Service[];
    const filtered =
      activeFilter === "todos"
        ? list
        : list.filter((s) => s.category === activeFilter);
    const byCategory: Record<ServiceCategory, Service[]> = {
      facial: [],
      corporal: [],
      especial: [],
    };
    for (const s of list) byCategory[s.category].push(s);
    return { filtered, byCategory };
  }, [services, activeFilter]);

  const setFilter = (key: FilterKey) => {
    navigate({
      search: key === "todos" ? {} : { categoria: key },
    });
  };

  return (
    <section
      id="servicios"
      className="relative scroll-mt-20 bg-background py-20 sm:py-24"
      data-ocid="services.section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal direction="up" className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-prism-violet">
            Nuestros servicios
          </span>
          <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
            Cuidados pensados para ti
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Limpiezas faciales, masajes y tratamientos especiales. Cupos
            limitados para garantizar atención personalizada.
          </p>
        </SectionReveal>

        {/* Category filter tabs — URL-persisted */}
        <SectionReveal
          direction="fade"
          delay={0.1}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {FILTER_TABS.map((tab) => {
            const active = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                data-ocid={tab.ocid}
                aria-pressed={active}
                className={`inline-flex items-center rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] transition-smooth ${
                  active
                    ? "border-prism-violet/50 bg-accent/15 text-prism-violet"
                    : "border-border bg-card/60 text-muted-foreground hover:border-prism-violet/30 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </SectionReveal>

        {/* Services grid */}
        {isLoading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {["a", "b", "c", "d", "e", "f"].map((k, i) => (
              <div
                key={`skeleton-services-${k}`}
                className="h-72 animate-pulse rounded-2xl border border-border bg-card/50"
                data-ocid={`services.loading_state.${i + 1}`}
              />
            ))}
          </div>
        ) : grouped.filtered.length === 0 ? (
          <div
            className="mt-10 rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center"
            data-ocid="services.empty_state"
          >
            <p className="font-display text-lg text-foreground">
              No hay servicios en esta categoría
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prueba con otro filtro o explora todos nuestros servicios.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.filtered.map((service, i) => (
              <ServiceCard
                key={String(service.id)}
                service={service}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Category counts microcopy */}
        {activeFilter === "todos" && (
          <p className="mt-8 text-center font-mono text-xs text-muted-foreground">
            {SERVICE_CATEGORY_LABEL.facial}: {grouped.byCategory.facial.length}{" "}
            · {SERVICE_CATEGORY_LABEL.corporal}:{" "}
            {grouped.byCategory.corporal.length} ·{" "}
            {SERVICE_CATEGORY_LABEL.especial}:{" "}
            {grouped.byCategory.especial.length}
          </p>
        )}
      </div>
    </section>
  );
}

// ---------- Combos ----------

function CombosSection() {
  const { data: combos, isLoading } = useCombos();

  return (
    <section
      id="combos"
      className="relative scroll-mt-20 bg-muted/30 py-20 sm:py-24"
      data-ocid="combos.section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal direction="up" className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-prism-rose">
            Combos y promociones
          </span>
          <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
            Invierte en ti, ahorra más
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Promociones pensadas para clientas nuevas, tratamientos mensuales y
            ofertas vigentes hasta diciembre.
          </p>
        </SectionReveal>

        {isLoading ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {["a", "b", "c"].map((k, i) => (
              <div
                key={`skeleton-combos-${k}`}
                className="h-80 animate-pulse rounded-2xl border border-border bg-card/50"
                data-ocid={`combos.loading_state.${i + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {(combos ?? []).slice(0, 3).map((combo, i) => (
              <ComboCard key={String(combo.id)} combo={combo} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Equipo ----------

function EquipoSection() {
  const { data: workers, isLoading } = useWorkers();

  return (
    <section
      id="equipo"
      className="relative scroll-mt-20 bg-background py-20 sm:py-24"
      data-ocid="equipo.section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal direction="up" className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-prism-cyan">
            Nuestro equipo
          </span>
          <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
            Manos expertas, trato cercano
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Profesionales dedicadas al cuidado de tu piel y tu bienestar.
          </p>
        </SectionReveal>

        {isLoading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {["a", "b", "c", "d"].map((k, i) => (
              <div
                key={`skeleton-equipo-${k}`}
                className="h-72 animate-pulse rounded-2xl border border-border bg-card/50"
                data-ocid={`equipo.loading_state.${i + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(workers ?? []).map((worker, i) => (
              <WorkerCard
                key={String(worker.id)}
                worker={worker}
                index={i}
                servicesCount={worker.servicesIds.length}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Protocol entry ----------

function ProtocolSection() {
  return (
    <section
      className="relative bg-muted/30 py-20 sm:py-24"
      data-ocid="protocol.section"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionReveal direction="up">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-12">
            {/* Prism border accent */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-[length:200%_100%] animate-prism-shimmer"
              style={{ backgroundImage: "var(--gradient-prism)" }}
            />
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-prism-violet">
                  <Users className="size-3.5" />
                  Red de profesionales Liza
                </span>
                <h2 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
                  ¿Eres profesional de la belleza?
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Sumate a la red de Liza y accede a un protocolo de trabajo
                  colaborativo, cupos exclusivos y descuentos con nuestros
                  partners. Conocé cómo funciona nuestro protocolo y forma parte
                  del espacio.
                </p>
              </div>
              <BlackGlassButton
                size="lg"
                asChild
                data-ocid="protocol.unete_button"
              >
                <a href="/unete" rel="noopener">
                  Conoce el protocolo
                  <ArrowRight className="size-4" />
                </a>
              </BlackGlassButton>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

// ---------- Testimonials ----------

function TestimonialsSection() {
  const { data: testimonials, isLoading } = useTestimonials();

  return (
    <section
      id="testimonios"
      className="relative scroll-mt-20 bg-background py-20 sm:py-24"
      data-ocid="testimonials.section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal direction="up" className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-prism-gold">
            Testimonios
          </span>
          <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
            Lo que dicen nuestras clientas
          </h2>
        </SectionReveal>

        {isLoading ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {["a", "b", "c"].map((k, i) => (
              <div
                key={`skeleton-testimonials-${k}`}
                className="h-56 animate-pulse rounded-2xl border border-border bg-card/50"
                data-ocid={`testimonials.loading_state.${i + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {(testimonials ?? []).slice(0, 6).map((t, i) => (
              <SectionReveal
                as="article"
                direction="up"
                delay={revealDelay(i)}
                key={String(t.id)}
                className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                {/* Prism accent corner */}
                <span
                  aria-hidden
                  className="absolute right-0 top-0 h-16 w-16 rounded-bl-full opacity-20"
                  style={{
                    background:
                      "radial-gradient(80% 80% at 100% 0%, oklch(var(--prism-rose)), transparent 70%)",
                  }}
                />
                <div
                  className="flex gap-0.5 text-prism-gold"
                  aria-label="5 de 5 estrellas"
                >
                  {["1", "2", "3", "4", "5"].map((s) => (
                    <Star key={`star-${s}`} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                  “{t.comment}”
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span
                    aria-hidden
                    className="flex size-9 items-center justify-center rounded-full font-display text-sm text-prism-violet"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(var(--prism-rose) / 0.2), oklch(var(--prism-violet) / 0.2))",
                    }}
                  >
                    {t.clientName.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-body text-sm font-medium text-foreground">
                    {t.clientName}
                  </span>
                </div>
              </SectionReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Partners banner ----------

function PartnersBanner() {
  const { data: partners } = usePartners();
  const backendList = partners ?? [];
  const list = backendList.length > 0 ? backendList : FALLBACK_PARTNERS;

  return (
    <section
      className="relative bg-muted/30 py-14"
      data-ocid="partners.section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal direction="fade" className="text-center">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <Heart className="size-3.5 text-prism-rose" />
            Pagos fáciles con Flow
          </span>
          <h3 className="mt-3 font-display text-xl text-foreground">
            Descuentos exclusivos del protocolo con nuestros partners
          </h3>
        </SectionReveal>

        {list.length > 0 && (
          <SectionReveal
            direction="up"
            delay={0.1}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {list.map((p, i) => (
              <span
                key={String(p.id)}
                data-ocid={`partners.item.${i + 1}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-foreground/80 backdrop-blur-sm transition-smooth hover:border-prism-violet/40 hover:text-foreground"
              >
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-prism-violet"
                />
                <span className="font-display">{p.logoText || p.name}</span>
              </span>
            ))}
          </SectionReveal>
        )}
      </div>
    </section>
  );
}

// ---------- Page ----------

export function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <PrismDivider className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <ServicesSection />
      <PrismDivider className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <CombosSection />
      <PrismDivider className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <EquipoSection />
      <PrismDivider className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <ProtocolSection />
      <PrismDivider className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <TestimonialsSection />
      <PrismDivider className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <PartnersBanner />
    </div>
  );
}
