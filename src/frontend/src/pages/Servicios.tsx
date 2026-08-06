import { MintableItemType } from "@/backend";
import { BlackGlassButton } from "@/components/BlackGlassButton";
import { PrismDivider } from "@/components/PrismDivider";
import { SectionReveal, revealDelay } from "@/components/SectionReveal";
import { VusdPayButton } from "@/components/VusdPayButton";
import { VusdPayModal } from "@/components/VusdPayModal";
import { useProducts, useServices } from "@/hooks/useQueries";
import { useMintedTokens, useVusdSession } from "@/hooks/useVusd";
import { cn } from "@/lib/utils";
import {
  PRODUCT_BADGE_LABEL,
  type Product,
  type ProductBadge,
  SERVICE_CATEGORY_LABEL,
  type Service,
  ServiceCategory,
  formatCLP,
} from "@/types";
import { WA_URL } from "@/components/Layout";
import { generateOrderId, useFlowPayment } from "@/hooks/useFlowPayment";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Heart,
  Layers,
  MessageCircle,
  Sparkles,
  Tag,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useMemo, useState } from "react";

const AGENDAPRO_URL = "https://lizaespaciobelleza.cl";

// Ordered categories for navigation — matches sidebar/anchor order.
const CATEGORY_ORDER: ServiceCategory[] = [
  ServiceCategory.facial,
  ServiceCategory.corporal,
  ServiceCategory.especial,
];

// Map a service's techniques to short benefit-oriented labels.
// Techniques are already human-readable strings from the backend.
function deriveBenefits(service: Service): string[] {
  // Build benefits from techniques + a couple of consistent anchors.
  const benefits: string[] = [];
  if (service.techniques.length > 0) {
    benefits.push(...service.techniques.map((t) => `${t}`));
  }
  if (service.allIncluded) {
    benefits.push("Productos y herramientas incluidos");
    benefits.push("Acompañamiento post-tratamiento");
  }
  return benefits;
}

function CategoryNav({
  active,
  counts,
  onSelect,
}: {
  active: ServiceCategory;
  counts: Record<ServiceCategory, number>;
  onSelect: (c: ServiceCategory) => void;
}) {
  return (
    <>
      {/* Desktop sticky sidebar */}
      <nav
        aria-label="Categorías de servicios"
        className="hidden lg:block"
        data-ocid="servicios.category_nav"
      >
        <div className="sticky top-24 space-y-2">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
            Categorías
          </span>
          {CATEGORY_ORDER.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelect(cat)}
                data-ocid={`servicios.category_tab.${cat}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-smooth",
                  isActive
                    ? "border-prism-violet/40 bg-accent/10 shadow-soft"
                    : "border-border bg-card hover:border-prism-violet/30 hover:bg-muted/40",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rounded-full transition-smooth",
                      isActive
                        ? "bg-prism-rose animate-prism-pulse"
                        : "bg-muted-foreground/50",
                    )}
                  />
                  <span
                    className={cn(
                      "font-display text-sm",
                      isActive ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {SERVICE_CATEGORY_LABEL[cat]}
                  </span>
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {counts[cat]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile horizontal pills */}
      <div
        className="-mx-4 overflow-x-auto px-4 lg:hidden"
        data-ocid="servicios.category_nav_mobile"
      >
        <div className="flex gap-2 pb-1">
          {CATEGORY_ORDER.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelect(cat)}
                data-ocid={`servicios.category_tab_mobile.${cat}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-smooth",
                  isActive
                    ? "border-prism-violet/40 bg-accent/10 text-foreground"
                    : "border-border bg-card text-foreground/80",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    isActive
                      ? "bg-prism-rose animate-prism-pulse"
                      : "bg-muted-foreground/50",
                  )}
                />
                {SERVICE_CATEGORY_LABEL[cat]}
                <span className="font-mono text-xs text-muted-foreground">
                  {counts[cat]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ServiceDetailCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const [vusdOpen, setVusdOpen] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const { createPaymentLink, isPending, paymentUrl, error: flowError, reset } = useFlowPayment();

  async function handleFlow() {
    if (!showEmailInput) { setShowEmailInput(true); setTimeout(() => emailRef.current?.focus(), 50); return; }
    if (!email) { emailRef.current?.focus(); return; }
    await createPaymentLink({
      amount: Number(service.priceCLP),
      subject: service.name,
      email,
      orderId: generateOrderId(service.id),
    });
  }

  function flowWaMsg(url: string) {
    return `Hola! Te enviamos el link de pago para *${service.name}*:\n${url}`;
  }
  const benefits = useMemo(() => deriveBenefits(service), [service]);
  const { walletId } = useVusdSession();
  const mintedQuery = useMintedTokens(walletId);

  const minted = (mintedQuery.data ?? []).some(
    (t) => t.itemType === MintableItemType.service && t.itemId === service.id,
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: revealDelay(index),
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card shadow-soft transition-smooth",
        open
          ? "border-prism-violet/40 shadow-elevated"
          : "border-border hover:-translate-y-0.5 hover:shadow-elevated",
      )}
      data-ocid={`servicios.service_card.${index + 1}`}
    >
      <VusdPayModal
        open={vusdOpen}
        onOpenChange={setVusdOpen}
        itemType={MintableItemType.service}
        itemId={service.id}
        itemName={service.name}
        priceCLP={service.priceCLP}
        onSuccess={() => {
          void mintedQuery.refetch();
        }}
      />
      {/* Prism top accent */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[length:200%_100%] opacity-60"
        style={{ backgroundImage: "var(--gradient-prism)" }}
      />

      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`service-detail-${service.id}`}
        data-ocid={`servicios.service_toggle.${index + 1}`}
        className="flex w-full items-start justify-between gap-4 p-6 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-prism-violet">
              {SERVICE_CATEGORY_LABEL[service.category]}
            </span>
            {service.allIncluded && (
              <span className="inline-flex items-center gap-1 rounded-full border border-prism-rose/30 bg-prism-rose/10 px-2 py-0.5 text-[0.65rem] font-medium text-prism-rose">
                <Sparkles className="size-3" />
                Todo incluido
              </span>
            )}
          </div>
          <h3 className="mt-1.5 font-display text-2xl leading-tight text-foreground">
            {service.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {service.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-prism-cyan" />
              {Number(service.durationMins)} min
            </span>
            <span className="inline-flex items-center gap-1.5 font-display text-base text-foreground">
              {formatCLP(service.priceCLP)}
            </span>
          </div>
        </div>
        <span
          aria-hidden
          className={cn(
            "mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/60 text-foreground/70 transition-smooth",
            open && "rotate-180 border-prism-violet/40 text-prism-violet",
          )}
        >
          <ChevronDown className="size-4" />
        </span>
      </button>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`service-detail-${service.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border bg-muted/20 px-6 py-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Qué es */}
                <div>
                  <h4 className="flex items-center gap-2 font-display text-sm text-foreground">
                    <Layers className="size-4 text-prism-violet" />
                    Qué es
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.longDescription}
                  </p>
                </div>

                {/* Beneficios */}
                <div>
                  <h4 className="flex items-center gap-2 font-display text-sm text-foreground">
                    <Heart className="size-4 text-prism-rose" />
                    Beneficios
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {benefits.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Técnicas aplicadas */}
                {service.techniques.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-display text-sm text-foreground">
                      <Sparkles className="size-4 text-prism-cyan" />
                      Técnicas aplicadas
                    </h4>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {service.techniques.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-prism-violet/25 bg-accent/10 px-3 py-1 text-xs text-foreground/85"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Herramientas / Productos incluidos */}
                <div>
                  <h4 className="flex items-center gap-2 font-display text-sm text-foreground">
                    <Wrench className="size-4 text-prism-gold" />
                    Herramientas / Productos incluidos
                  </h4>
                  {service.toolsIncluded.length > 0 ? (
                    <ul className="mt-2 space-y-1.5">
                      {service.toolsIncluded.map((tool) => (
                        <li
                          key={tool}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span
                            aria-hidden
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-prism-gold"
                          />
                          <span>{tool}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Consulta por herramientas específicas al agendar.
                    </p>
                  )}
                  {service.allIncluded && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-prism-rose/30 bg-prism-rose/10 px-3 py-1 text-xs font-medium text-prism-rose">
                      <Sparkles className="size-3" />
                      Todo incluido · sin costo extra
                    </span>
                  )}
                </div>
              </div>

              {/* Footer row: price + agendar + vUSD */}
              <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
                <div>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                    Desde
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl text-foreground">
                      {formatCLP(service.priceCLP)}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      · {Number(service.durationMins)} min
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-2">
                    <BlackGlassButton
                      size="default"
                      asChild
                      data-ocid={`servicios.agendar_button.${index + 1}`}
                    >
                      <a
                        href={service.agendaproUrl || AGENDAPRO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Calendar className="size-4" />
                        Agenda este servicio
                      </a>
                    </BlackGlassButton>
                    <a
                      href={WA_URL(`Hola! Quiero agendar: ${service.name} (${formatCLP(service.priceCLP)})`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 text-sm font-medium text-[#1a9e4a] transition-smooth hover:bg-[#25D366]/20 dark:text-[#25D366]"
                    >
                      <MessageCircle className="size-4" />
                      WhatsApp
                    </a>
                    <button
                      onClick={handleFlow}
                      disabled={isPending}
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-prism-cyan/40 bg-prism-cyan/10 px-4 text-sm font-medium text-prism-cyan transition-smooth hover:bg-prism-cyan/20 disabled:opacity-50"
                    >
                      <CreditCard className="size-4" />
                      {isPending ? "Generando…" : "Pagar con Flow"}
                    </button>
                    <VusdPayButton
                      itemType={MintableItemType.service}
                      itemId={service.id}
                      itemName={service.name}
                      priceCLP={service.priceCLP}
                      onPay={() => setVusdOpen(true)}
                      minted={minted}
                      ocidSuffix={`servicios.${index + 1}`}
                    />
                  </div>

                  {/* Flow: email input */}
                  {showEmailInput && !paymentUrl && (
                    <div className="flex items-center gap-2">
                      <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleFlow()}
                        placeholder="Correo del cliente"
                        className="h-9 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-prism-cyan"
                      />
                      <button
                        onClick={handleFlow}
                        disabled={isPending || !email}
                        className="inline-flex h-9 items-center gap-1 rounded-full bg-prism-cyan px-4 text-sm font-medium text-background transition-smooth hover:opacity-90 disabled:opacity-50"
                      >
                        {isPending ? "…" : "Generar link"}
                      </button>
                    </div>
                  )}

                  {/* Flow: link generado → enviar por WA o email */}
                  {paymentUrl && (
                    <div className="rounded-xl border border-prism-cyan/30 bg-prism-cyan/5 p-3">
                      <p className="mb-2 text-xs text-muted-foreground">Link de pago generado — envíalo al cliente:</p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(flowWaMsg(paymentUrl))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-3 text-xs font-medium text-[#1a9e4a] hover:bg-[#25D366]/20 dark:text-[#25D366]"
                        >
                          <MessageCircle className="size-3" />
                          Enviar por WhatsApp
                        </a>
                        <a
                          href={`mailto:${email}?subject=Tu link de pago — ${service.name}&body=${encodeURIComponent(`Hola!\n\nAquí está tu link de pago para ${service.name}:\n\n${paymentUrl}\n\nEquipo Liza Espacio Belleza`)}`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          Enviar por Email
                        </a>
                        <button
                          onClick={() => { void navigator.clipboard.writeText(paymentUrl); }}
                          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          Copiar link
                        </button>
                        <button onClick={reset} className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
                          Nueva orden
                        </button>
                      </div>
                    </div>
                  )}

                  {flowError && <p className="text-xs text-destructive">{flowError}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const badge = product.badge as ProductBadge | undefined;
  const badgeLabel = badge ? PRODUCT_BADGE_LABEL[badge] : null;
  const isNew = badge === "new";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: revealDelay(index),
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elevated"
      data-ocid={`servicios.product_card.${index + 1}`}
    >
      {/* Prism top accent on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px scale-x-0 bg-[length:200%_100%] transition-transform duration-500 group-hover:scale-x-100"
        style={{ backgroundImage: "var(--gradient-prism)" }}
      />

      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className="inline-flex size-10 items-center justify-center rounded-xl border border-prism-violet/25 bg-accent/10"
        >
          <Tag className="size-4 text-prism-violet" />
        </span>
        {badgeLabel && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium",
              isNew
                ? "border-prism-rose/30 bg-prism-rose/10 text-prism-rose"
                : "border-prism-cyan/30 bg-prism-cyan/10 text-prism-cyan",
            )}
          >
            <Sparkles className="size-3" />
            {badgeLabel}
          </span>
        )}
      </div>

      <h4 className="mt-4 font-display text-lg leading-tight text-foreground">
        {product.name}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      {product.usage && (
        <div className="mt-auto pt-4">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
            Uso recomendado
          </span>
          <p className="mt-1 text-sm leading-relaxed text-foreground/85">
            {product.usage}
          </p>
        </div>
      )}
    </motion.article>
  );
}

export function ServiciosPage() {
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: products, isLoading: productsLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(
    ServiceCategory.facial,
  );

  const servicesByCategory = useMemo(() => {
    const map: Record<ServiceCategory, Service[]> = {
      [ServiceCategory.facial]: [],
      [ServiceCategory.corporal]: [],
      [ServiceCategory.especial]: [],
    };
    for (const s of services ?? []) {
      map[s.category].push(s);
    }
    return map;
  }, [services]);

  const counts: Record<ServiceCategory, number> = {
    [ServiceCategory.facial]: servicesByCategory[ServiceCategory.facial].length,
    [ServiceCategory.corporal]:
      servicesByCategory[ServiceCategory.corporal].length,
    [ServiceCategory.especial]:
      servicesByCategory[ServiceCategory.especial].length,
  };

  const handleSelectCategory = (cat: ServiceCategory) => {
    setActiveCategory(cat);
    if (typeof document !== "undefined") {
      document
        .getElementById(`categoria-${cat}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Hero — typography + gradient, no photo */}
      <section
        className="relative overflow-hidden bg-background"
        data-ocid="servicios.hero_section"
      >
        {/* Soft gradient backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{ backgroundImage: "var(--gradient-rose-soft)" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionReveal direction="up">
            <span className="inline-flex items-center gap-2 rounded-full border border-prism-violet/30 bg-card/60 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-prism-violet backdrop-blur-sm">
              <span className="size-1.5 animate-prism-pulse rounded-full bg-prism-rose" />
              Catálogo completo
            </span>
          </SectionReveal>
          <SectionReveal direction="up" delay={0.1}>
            <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              Todos los <span className="text-hero-gradient">Servicios</span>
              <br />
              explicados en detalle
            </h1>
          </SectionReveal>
          <SectionReveal direction="up" delay={0.2}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Cada tratamiento, sus técnicas, duración y qué incluye. Explora
              nuestras categorías Faciales, Corporales y Especiales, y conoce
              los productos profesionales que utilizamos en cada sesión.
            </p>
          </SectionReveal>
          <SectionReveal direction="up" delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <BlackGlassButton
                size="lg"
                asChild
                data-ocid="servicios.hero_agendar_button"
              >
                <a
                  href={AGENDAPRO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="size-4" />
                  Agenda tu Hora
                </a>
              </BlackGlassButton>
              <button
                type="button"
                onClick={() => handleSelectCategory(ServiceCategory.facial)}
                data-ocid="servicios.hero_explore_link"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card/60 px-6 text-sm font-medium text-foreground/80 backdrop-blur-sm transition-smooth hover:border-prism-violet/40 hover:text-foreground"
              >
                Explorar servicios
                <ChevronDown className="size-4" />
              </button>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Body — sidebar + service sections */}
      <section className="bg-background" data-ocid="servicios.body_section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile category nav sits at top of body */}
          <div className="pt-10 lg:hidden">
            <CategoryNav
              active={activeCategory}
              counts={counts}
              onSelect={handleSelectCategory}
            />
          </div>

          <div className="grid gap-10 py-10 lg:grid-cols-[220px_1fr] lg:py-14">
            {/* Desktop sticky sidebar */}
            <CategoryNav
              active={activeCategory}
              counts={counts}
              onSelect={handleSelectCategory}
            />

            {/* Service sections per category */}
            <div className="space-y-16">
              {CATEGORY_ORDER.map((cat) => (
                <section
                  key={cat}
                  id={`categoria-${cat}`}
                  className="scroll-mt-24"
                  data-ocid={`servicios.category_section.${cat}`}
                >
                  <SectionReveal direction="left">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-prism-violet">
                          {counts[cat]}{" "}
                          {counts[cat] === 1 ? "servicio" : "servicios"}
                        </span>
                        <h2 className="mt-1 font-display text-3xl text-foreground sm:text-4xl">
                          {SERVICE_CATEGORY_LABEL[cat]}
                        </h2>
                      </div>
                    </div>
                  </SectionReveal>

                  <div className="mt-6">
                    <PrismDivider />
                  </div>

                  {servicesLoading && counts[cat] === 0 ? (
                    <div
                      className="mt-8 space-y-3"
                      data-ocid="servicios.loading_state"
                    >
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-28 animate-pulse rounded-2xl border border-border bg-muted/40"
                        />
                      ))}
                    </div>
                  ) : servicesByCategory[cat].length === 0 ? (
                    <div
                      className="mt-8 rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center"
                      data-ocid="servicios.empty_state"
                    >
                      <p className="font-display text-lg text-foreground">
                        Próximamente nuevos servicios en esta categoría
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Mientras tanto, agenda cualquier servicio disponible en
                        AgendaPro.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-8 space-y-4">
                      {servicesByCategory[cat].map((service, i) => (
                        <ServiceDetailCard
                          key={String(service.id)}
                          service={service}
                          index={i}
                        />
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products section — promotional */}
      <section className="bg-muted/30" data-ocid="servicios.products_section">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionReveal direction="up">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-prism-violet/30 bg-card/60 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-prism-violet">
                <Sparkles className="size-3" />
                Productos que utilizamos
              </span>
              <h2 className="mt-5 font-display text-3xl text-foreground sm:text-4xl">
                Marcas y productos profesionales
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Trabajamos con productos seleccionados por nuestro equipo. Aquí
                algunos destacados que recomendamos para tu rutina en casa.
              </p>
            </div>
          </SectionReveal>

          <div className="mt-10">
            <PrismDivider />
          </div>

          {productsLoading && (products ?? []).length === 0 ? (
            <div
              className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              data-ocid="servicios.products_loading_state"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse rounded-2xl border border-border bg-card/60"
                />
              ))}
            </div>
          ) : (products ?? []).length === 0 ? (
            <div
              className="mt-10 rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center"
              data-ocid="servicios.products_empty_state"
            >
              <p className="font-display text-lg text-foreground">
                Pronto compartiremos nuestros productos favoritos
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(products ?? []).map((product, i) => (
                <ProductCard
                  key={String(product.id)}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-background" data-ocid="servicios.cta_section">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionReveal direction="up">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-soft sm:p-14">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-[length:200%_100%] animate-prism-shimmer"
                style={{ backgroundImage: "var(--gradient-prism)" }}
              />
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                ¿Lista para tu próxima sesión?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Reserva tu hora en AgendaPro en pocos clics. Te esperamos en
                Providencia.
              </p>
              <div className="mt-7 flex justify-center">
                <BlackGlassButton
                  size="lg"
                  asChild
                  data-ocid="servicios.bottom_agendar_button"
                >
                  <a
                    href={AGENDAPRO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="size-4" />
                    Agenda tu Hora
                  </a>
                </BlackGlassButton>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
