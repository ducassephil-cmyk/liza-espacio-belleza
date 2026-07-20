import { BlackGlassButton } from "@/components/BlackGlassButton";
import { PrismDivider } from "@/components/PrismDivider";
import { SectionReveal, revealDelay } from "@/components/SectionReveal";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type SubmitApplicationInput,
  usePartners,
  useSubmitApplication,
} from "@/hooks/useQueries";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Handshake,
  Layers,
  Mail,
  Network,
  Send,
  Sparkles,
  UserRound,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// ---- Static content (Spanish - Chile) ----

const PROTOCOL_STEPS = [
  {
    n: "01",
    title: "Postula",
    description:
      "Completa el formulario de postulación con tus datos, especialidad y un mensaje sobre tu trayectoria. Recibimos postulaciones todo el año.",
    icon: Send,
    accent: "text-prism-rose",
  },
  {
    n: "02",
    title: "Evaluación",
    description:
      "Nuestro equipo revisa tu postulación y agenda una entrevista presencial en el estudio. Conocemos tu propuesta de valor, técnicas y enfoque de servicio.",
    icon: BadgeCheck,
    accent: "text-prism-violet",
  },
  {
    n: "03",
    title: "Incorporación",
    description:
      "Si ambas partes coinciden, firmamos el protocolo de aliada, configuras tu agenda y comienzas a recibir servicios derivados desde Liza y viceversa.",
    icon: Handshake,
    accent: "text-prism-cyan",
  },
] as const;

const COMMISSION_ROWS = [
  {
    concept: "Fee de protocolo",
    detail: "Aporte único al incorporarte al protocolo Liza",
    value: "$25.000",
  },
  {
    concept: "Comisión por servicio",
    detail: "Rango estándar para la profesional aliada",
    value: "70% — 80%",
  },
  {
    concept: "Reparto por servicio",
    detail: "Liza retiene el porcentaje restante por derivación y gestión",
    value: "20% — 30%",
  },
  {
    concept: "Periodicidad de pago",
    detail: "Liquidación de comisiones a la profesional aliada",
    value: "Mensual",
  },
  {
    concept: "Medio de pago",
    detail: "Transferencia bancaria con respaldo de comprobante",
    value: "Flow / Transferencia",
  },
] as const;

const BENEFITS = [
  {
    title: "Perfil en la web",
    description:
      "Tu ficha de profesional aliada aparece en lizaespaciobelleza.cl con tu especialidad, técnicas y enlace directo a tu agenda.",
    icon: UserRound,
    accent: "text-prism-rose",
  },
  {
    title: "Servicios en ambas direcciones",
    description:
      "Aceptas servicios derivados desde Liza y a la vez puedes derivar clientas a otras aliadas de la red cuando lo necesites.",
    icon: ArrowRight,
    accent: "text-prism-violet",
  },
  {
    title: "Red de profesionales",
    description:
      "Acceso a una comunidad de especialistas en belleza facial, corporal y tratamientos especiales en Providencia.",
    icon: Network,
    accent: "text-prism-cyan",
  },
  {
    title: "Descuentos del protocolo",
    description:
      "Precios preferenciales con nuestros partners: pagos fáciles con Flow y descuentos exclusivos en insumos y servicios.",
    icon: Sparkles,
    accent: "text-prism-gold",
  },
] as const;

// ---- Page ----

export function UnetePage() {
  return (
    <div className="bg-background">
      <UneteHero />
      <PrismDivider className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <ProtocolSteps />
      <CommissionSection />
      <BenefitsSection />
      <PartnersBanner />
      <ApplicationForm />
    </div>
  );
}

// ---- Hero ----

function UneteHero() {
  return (
    <section
      data-ocid="unete.hero.section"
      className="relative overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background"
    >
      {/* Soft prism glow accents */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(var(--prism-rose) / 0.25), transparent 70%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(var(--prism-violet) / 0.22), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionReveal direction="up" className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-prism-violet/30 bg-accent/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-prism-violet">
            <span className="size-1.5 animate-prism-pulse rounded-full bg-prism-rose" />
            Protocolo Liza · Aliadas
          </span>

          <h1 className="mt-6 font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Únete al <span className="text-hero-gradient">protocolo Liza</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Somos una red de profesionales aliadas de belleza en Providencia,
            Santiago de Chile. Si valoras el trabajo bien hecho, la cercanía con
            tus clientas y quieres crecer dentro de una comunidad que se cuida,
            este es tu espacio.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BlackGlassButton
              size="lg"
              asChild
              data-ocid="unete.hero.postular_button"
            >
              <a href="#postular">
                <Send className="size-4" />
                Postular al protocolo
              </a>
            </BlackGlassButton>
            <a
              href="#como-funciona"
              data-ocid="unete.hero.ver_pasos_link"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 font-body text-sm font-medium text-foreground transition-smooth hover:border-prism-violet/40 hover:bg-muted/40"
            >
              Ver cómo funciona
              <ArrowRight className="size-4" />
            </a>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

// ---- Protocol steps ----

function ProtocolSteps() {
  return (
    <section
      id="como-funciona"
      data-ocid="unete.como_funciona.section"
      className="bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionReveal direction="up" className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-prism-rose">
            Cómo funciona
          </p>
          <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
            El protocolo para unirte como aliada
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tres pasos simples y transparentes para incorporarte a la red Liza.
            Sin letra chica, sin compromisos ocultos.
          </p>
        </SectionReveal>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {PROTOCOL_STEPS.map((step, i) => (
            <SectionReveal
              as="li"
              key={step.n}
              direction="up"
              delay={revealDelay(i)}
            >
              <Card
                data-ocid={`unete.como_funciona.step.${i + 1}`}
                className="group relative h-full overflow-hidden border-border bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:border-prism-violet/40 hover:shadow-elevated"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[length:200%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundImage: "var(--gradient-prism)" }}
                />
                <CardContent className="flex h-full flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm tracking-[0.2em] text-muted-foreground">
                      {step.n}
                    </span>
                    <step.icon
                      className={`size-6 ${step.accent}`}
                      aria-hidden
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </SectionReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---- Commission section ----

function CommissionSection() {
  return (
    <section
      id="comisiones"
      data-ocid="unete.comisiones.section"
      className="bg-muted/30"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: heading + summary cards */}
          <SectionReveal direction="left" className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-prism-violet">
              Comisiones y honorarios
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              Estructura clara, sin sorpresas
            </h2>
            <p className="mt-4 text-muted-foreground">
              El protocolo Liza funciona con una comisión negociada en backend
              por cada servicio derivado. La profesional aliada recibe entre el
              70% y el 80% del valor del servicio, según el rango acordado en su
              contrato.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <SummaryCard
                icon={Wallet}
                accent="text-prism-rose"
                label="Para la aliada"
                value="70% — 80%"
                hint="del valor del servicio"
              />
              <SummaryCard
                icon={CalendarClock}
                accent="text-prism-cyan"
                label="Liquidación"
                value="Mensual"
                hint="vía Flow o transferencia"
              />
            </div>
          </SectionReveal>

          {/* Right: conditions table */}
          <SectionReveal direction="right" className="lg:col-span-7">
            <Card
              data-ocid="unete.comisiones.table"
              className="overflow-hidden border-border bg-card shadow-soft"
            >
              <div className="border-b border-border bg-muted/40 px-6 py-4">
                <h3 className="font-display text-lg text-foreground">
                  Condiciones del protocolo
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Valores de referencia · sujetos a contrato individual
                </p>
              </div>
              <div className="divide-y divide-border">
                {COMMISSION_ROWS.map((row, i) => (
                  <div
                    key={row.concept}
                    data-ocid={`unete.comisiones.row.${i + 1}`}
                    className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-12 sm:items-center sm:gap-4"
                  >
                    <div className="sm:col-span-5">
                      <p className="font-body text-sm font-medium text-foreground">
                        {row.concept}
                      </p>
                    </div>
                    <div className="sm:col-span-4">
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {row.detail}
                      </p>
                    </div>
                    <div className="sm:col-span-3 sm:text-right">
                      <span className="inline-flex items-center rounded-full border border-prism-violet/30 bg-accent/10 px-3 py-1 font-mono text-sm font-medium text-prism-violet">
                        {row.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <p className="mt-4 text-xs text-muted-foreground">
              Los porcentajes y montos son referenciales y se confirman en el
              contrato de aliada. Esta versión del sitio no incluye negociación
              de comisiones en línea.
            </p>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  icon: Icon,
  accent,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft transition-smooth hover:border-prism-violet/40">
      <Icon className={`size-5 ${accent}`} aria-hidden />
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

// ---- Benefits ----

function BenefitsSection() {
  return (
    <section
      id="beneficios"
      data-ocid="unete.beneficios.section"
      className="bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionReveal direction="up" className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-prism-cyan">
            Beneficios
          </p>
          <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
            Por qué ser aliada de Liza
          </h2>
          <p className="mt-4 text-muted-foreground">
            Más que un espacio físico, te sumas a una red que deriva, cuida y
            hace crecer tu carrera profesional.
          </p>
        </SectionReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <SectionReveal key={b.title} direction="up" delay={revealDelay(i)}>
              <Card
                data-ocid={`unete.beneficios.card.${i + 1}`}
                className="group h-full border-border bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:border-prism-violet/40 hover:shadow-elevated"
              >
                <CardContent className="flex h-full flex-col p-6">
                  <span
                    aria-hidden
                    className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-muted/40 transition-smooth group-hover:border-prism-violet/40"
                  >
                    <b.icon className={`size-5 ${b.accent}`} />
                  </span>
                  <h3 className="mt-5 font-display text-lg text-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {b.description}
                  </p>
                </CardContent>
              </Card>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Partners banner ----

function PartnersBanner() {
  const { data, isLoading } = usePartners();
  const partners = data && data.length > 0 ? data : FALLBACK_PARTNERS;

  return (
    <section data-ocid="unete.partners.section" className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionReveal direction="up">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-soft sm:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[length:200%_100%] animate-prism-shimmer"
              style={{ backgroundImage: "var(--gradient-prism)" }}
            />
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-md">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-prism-gold">
                  Partners del protocolo
                </p>
                <h2 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
                  Pagos fáciles con Flow
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Descuentos exclusivos del protocolo con nuestros partners. Las
                  aliadas acceden a medios de pago simples y a precios
                  preferenciales en insumos y servicios.
                </p>
              </div>

              <ul className="flex flex-wrap gap-3 lg:justify-end">
                {isLoading
                  ? ["a", "b", "c"].map((k) => (
                      <li
                        key={`skeleton-${k}`}
                        className="h-16 w-40 animate-pulse rounded-xl border border-border bg-muted/40"
                        aria-hidden
                      />
                    ))
                  : partners.map((p, i) => (
                      <li
                        key={p.id.toString()}
                        data-ocid={`unete.partners.item.${i + 1}`}
                        className="flex min-w-40 max-w-48 items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 transition-smooth hover:border-prism-violet/40"
                      >
                        <span
                          aria-hidden
                          className="inline-flex size-9 items-center justify-center rounded-lg bg-glass font-display text-sm text-glass"
                        >
                          {p.logoText.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-body text-sm font-medium text-foreground">
                            {p.name}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {p.description}
                          </span>
                        </span>
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

// Fallback partners shown while the backend is loading or returns empty.
const FALLBACK_PARTNERS = [
  {
    id: 1n,
    name: "Flow",
    description: "Pagos fáciles en línea",
    logoText: "FL",
  },
  {
    id: 2n,
    name: "Descuentos Protocolo",
    description: "Insumos y servicios",
    logoText: "DP",
  },
  {
    id: 3n,
    name: "Red Liza",
    description: "Derivaciones entre aliadas",
    logoText: "LZ",
  },
] as const;

// ---- Application form ----

type FormValues = SubmitApplicationInput;

function ApplicationForm() {
  const form = useForm<FormValues>({
    defaultValues: { name: "", email: "", specialty: "", message: "" },
  });
  const mutation = useSubmitApplication();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          toast.success("¡Postulación enviada!", {
            description:
              "Nuestro equipo revisará tu postulación y te contactará por email.",
          });
          form.reset();
        } else {
          const err = result.err;
          const msg =
            err.__kind__ === "invalidInput"
              ? err.invalidInput
              : err.__kind__ === "notFound"
                ? err.notFound
                : err.unauthorized;
          toast.error("No pudimos enviar tu postulación", {
            description: msg,
          });
        }
      },
      onError: (error) => {
        toast.error("No pudimos enviar tu postulación", {
          description:
            error.message ||
            "Ocurrió un error inesperado. Intenta nuevamente en unos minutos.",
        });
      },
    });
  };

  const isSubmitting = mutation.isPending;

  return (
    <section
      id="postular"
      data-ocid="unete.postular.section"
      className="bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: invitation copy */}
          <SectionReveal direction="left" className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-prism-rose">
              Postular al protocolo
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              Cuéntanos sobre ti
            </h2>
            <p className="mt-4 text-muted-foreground">
              Completa el formulario y nuestro equipo te contactará para agendar
              una entrevista en el estudio. Esta versión del sitio es
              informativa: no requiere inicio de sesión ni creación de perfil.
            </p>

            <ul className="mt-8 space-y-4">
              <ContactItem
                icon={Mail}
                accent="text-prism-violet"
                label="Email del equipo"
                value="contacto@lizaespaciobelleza.cl"
              />
              <ContactItem
                icon={Layers}
                accent="text-prism-rose"
                label="Especialidades que buscamos"
                value="Facial · Corporal · Tratamientos especiales"
              />
              <ContactItem
                icon={CalendarClock}
                accent="text-prism-cyan"
                label="Tiempo de respuesta"
                value="Hasta 5 días hábiles"
              />
            </ul>
          </SectionReveal>

          {/* Right: form */}
          <SectionReveal direction="right" className="lg:col-span-7">
            <Card
              data-ocid="unete.postular.form"
              className="relative overflow-hidden border-border bg-card shadow-elevated"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[length:200%_100%] animate-prism-shimmer"
                style={{ backgroundImage: "var(--gradient-prism)" }}
              />
              <CardContent className="p-7 sm:p-9">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    noValidate
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        rules={{
                          required: "Ingresa tu nombre",
                          minLength: {
                            value: 2,
                            message: "Mínimo 2 caracteres",
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej. Camila Rojas"
                                autoComplete="name"
                                data-ocid="unete.postular.name_input"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage data-ocid="unete.postular.name.field_error" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        rules={{
                          required: "Ingresa tu email",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Email no válido",
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email de contacto</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="tu@email.cl"
                                autoComplete="email"
                                data-ocid="unete.postular.email_input"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage data-ocid="unete.postular.email.field_error" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="specialty"
                      rules={{
                        required: "Indica tu especialidad",
                        minLength: {
                          value: 3,
                          message: "Mínimo 3 caracteres",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especialidad</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej. Esteticista facial · Lifting de pestañas"
                              data-ocid="unete.postular.specialty_input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage data-ocid="unete.postular.specialty.field_error" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      rules={{
                        required: "Cuéntanos brevemente sobre ti",
                        minLength: {
                          value: 20,
                          message: "Mínimo 20 caracteres",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensaje</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Cuenta tu trayectoria, técnicas que manejas y por qué quieres sumarte al protocolo Liza."
                              rows={5}
                              data-ocid="unete.postular.message_textarea"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage data-ocid="unete.postular.message.field_error" />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        Al postular aceptas que el equipo de Liza te contacte
                        por email. No compartimos tus datos con terceros.
                      </p>
                      <BlackGlassButton
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        data-ocid="unete.postular.submit_button"
                        className={
                          isSubmitting
                            ? "data-[pending=true]:opacity-80"
                            : undefined
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <motion.span
                              aria-hidden
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 0.9,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                              className="size-4 rounded-full border-2 border-glass-foreground/40 border-t-glass-foreground"
                            />
                            Enviando…
                          </>
                        ) : (
                          <>
                            <Send className="size-4" />
                            Postular
                          </>
                        )}
                      </BlackGlassButton>
                    </div>

                    {mutation.isError && (
                      <p
                        role="alert"
                        data-ocid="unete.postular.error_state"
                        className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                      >
                        No pudimos enviar tu postulación. Revisa tu conexión e
                        intenta nuevamente.
                      </p>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon: Icon,
  accent,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40"
      >
        <Icon className={`size-4 ${accent}`} />
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <span className="mt-0.5 block text-sm text-foreground">{value}</span>
      </span>
    </li>
  );
}
