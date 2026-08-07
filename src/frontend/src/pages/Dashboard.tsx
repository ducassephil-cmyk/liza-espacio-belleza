import { WA_URL } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFlowPayment } from "@/hooks/useFlowPayment";
import { useInstagramMetrics } from "@/hooks/useInstagram";
import { useServices, useWorkers } from "@/hooks/useQueries";
import { useShopifyData } from "@/hooks/useShopify";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Heart,
  Instagram,
  Link2,
  MessageCircle,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Users,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── mock schedule (replaced by Appointly when connected) ──────────────────────
const MOCK_AGENDA = [
  {
    id: 1,
    worker: "Nersa",
    time: "10:00",
    endTime: "11:00",
    service: "Limpieza Facial Profunda",
    client: "Paola R.",
    confirmed: true,
  },
  {
    id: 2,
    worker: "Nersa",
    time: "12:30",
    endTime: "13:45",
    service: "Radiofrecuencia Facial",
    client: "Ana M.",
    confirmed: true,
  },
  {
    id: 3,
    worker: "Jennifer",
    time: "11:00",
    endTime: "12:00",
    service: "Drenaje Linfático Manual",
    client: "Carmen V.",
    confirmed: false,
  },
  {
    id: 4,
    worker: "Jennifer",
    time: "14:30",
    endTime: "16:00",
    service: "Masaje Reafirmante Corporal",
    client: "Sofía L.",
    confirmed: true,
  },
];

// ── helpers ───────────────────────────────────────────────────────────────────
function formatClp(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

function today() {
  return new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── ConnectBadge ──────────────────────────────────────────────────────────────
function ConnectBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[0.65rem] font-medium text-amber-600 dark:text-amber-400">
      <AlertCircle className="size-3" />
      {label}
    </span>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block size-2 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-400"}`}
    />
  );
}

// ── KPI tile ──────────────────────────────────────────────────────────────────
function KpiTile({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  mock,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent: string;
  mock?: boolean;
}) {
  return (
    <Card className="border-border bg-card shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <span
            className={`inline-flex size-9 items-center justify-center rounded-lg border border-border bg-muted/40 ${accent}`}
          >
            <Icon className="size-4" />
          </span>
          {mock && (
            <span className="rounded-full border border-border px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-wide text-muted-foreground">
              demo
            </span>
          )}
        </div>
        <p className="mt-4 font-display text-2xl text-foreground">{value}</p>
        <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ── Dashboard page ────────────────────────────────────────────────────────────
export function DashboardPage() {
  const shopify = useShopifyData();
  const instagram = useInstagramMetrics();

  const shopifyOk = !!shopify.data?.connected;
  const instagramOk = !!instagram.data?.connected;

  return (
    <div className="min-h-screen bg-muted/20">
      {/* ── header ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg text-foreground">
              ✦ Liza{" "}
              <span className="font-mono text-xs font-normal text-muted-foreground">
                ops
              </span>
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block capitalize">
              {today()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs">
              <StatusDot ok={true} />
              <span className="hidden sm:inline text-muted-foreground">Flow</span>
              <span className="text-amber-600 dark:text-amber-400">pendiente</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs">
              <StatusDot ok={shopifyOk} />
              <span className="text-muted-foreground hidden sm:inline">Shopify</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs">
              <StatusDot ok={instagramOk} />
              <span className="text-muted-foreground hidden sm:inline">IG</span>
            </span>
            <a
              href="/"
              className="hidden items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              Sitio
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiTile
            icon={Wallet}
            label="Ingresos agosto"
            value={shopifyOk ? formatClp(shopify.data?.revenue ?? 0) : "$485.000"}
            sub={shopifyOk ? "desde Shopify" : undefined}
            accent="text-prism-rose"
            mock={!shopifyOk}
          />
          <KpiTile
            icon={Calendar}
            label="Clientas hoy"
            value={String(MOCK_AGENDA.length)}
            sub={`${MOCK_AGENDA.filter((a) => a.confirmed).length} confirmadas`}
            accent="text-prism-violet"
            mock
          />
          <KpiTile
            icon={Zap}
            label="Links Flow"
            value="2"
            sub="pendientes de pago"
            accent="text-prism-cyan"
            mock
          />
          <KpiTile
            icon={MessageCircle}
            label="WA sin responder"
            value="5"
            accent="text-emerald-500"
            mock
          />
        </div>

        {/* ── main grid ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── left col (agenda + flow) ── */}
          <div className="space-y-6 lg:col-span-2">
            <AgendaSection />
            <FlowSection />
          </div>

          {/* ── right col ── */}
          <div className="space-y-6">
            <WhatsAppSection />
            <InstagramSection data={instagram.data} />
            <ConexionesSection shopifyOk={shopifyOk} instagramOk={instagramOk} />
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Agenda ────────────────────────────────────────────────────────────────────
function AgendaSection() {
  const { data: workers } = useWorkers();

  const nersa = workers?.find((w) => w.name === "Nersa");
  const jennifer = workers?.find((w) => w.name === "Jennifer");

  const workerColor = (name: string) =>
    name === "Nersa" ? "text-prism-violet" : "text-prism-cyan";

  return (
    <Card className="border-border bg-card shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="font-display text-base text-foreground">
          Agenda del día
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[0.65rem]">
            Demo · Appointly pendiente
          </Badge>
          {(nersa || jennifer) && (
            <div className="flex items-center gap-1.5">
              {nersa && (
                <span className="rounded-full border border-prism-violet/30 bg-prism-violet/10 px-2 py-0.5 font-mono text-[0.6rem] text-prism-violet">
                  Nersa
                </span>
              )}
              {jennifer && (
                <span className="rounded-full border border-prism-cyan/30 bg-prism-cyan/10 px-2 py-0.5 font-mono text-[0.6rem] text-prism-cyan">
                  Jennifer
                </span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {MOCK_AGENDA.map((appt) => (
          <div
            key={appt.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3"
          >
            <div className="w-16 shrink-0 text-right">
              <span className="font-mono text-sm text-foreground">{appt.time}</span>
              <span className="block font-mono text-[0.6rem] text-muted-foreground">
                {appt.endTime}
              </span>
            </div>
            <div className="w-px self-stretch bg-border" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {appt.client}
              </p>
              <p className="truncate text-xs text-muted-foreground">{appt.service}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className={`font-mono text-xs font-medium ${workerColor(appt.worker)}`}>
                {appt.worker}
              </span>
              {appt.confirmed ? (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ) : (
                <Clock className="size-4 text-amber-400" />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── Flow payments ─────────────────────────────────────────────────────────────
const MOCK_FLOW_LINKS = [
  { id: 1, client: "Paola R.", service: "Limpieza Facial Profunda", amount: 35000, status: "pending" as const },
  { id: 2, client: "Ana M.", service: "Radiofrecuencia Facial", amount: 55000, status: "pending" as const },
  { id: 3, client: "Carmen V.", service: "Drenaje Linfático Manual", amount: 40000, status: "paid" as const },
];

function FlowSection() {
  const { data: services } = useServices();
  const { createPaymentLink, isPending } = useFlowPayment();
  const [email, setEmail] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function handleGenerate() {
    const svc = services?.find((s) => s.name === selectedService);
    if (!svc || !email) {
      toast.error("Completa email y servicio");
      return;
    }
    const url = await createPaymentLink({
      amount: Number(svc.priceCLP),
      subject: svc.name,
      email,
      orderId: `DASH-${Date.now()}`,
    });
    if (url) {
      await navigator.clipboard.writeText(url).catch(() => null);
      toast.success("Link copiado", { description: url });
      setShowForm(false);
      setEmail("");
    }
  }

  return (
    <Card className="border-border bg-card shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="font-display text-base text-foreground">
          Pagos Flow
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 text-xs"
          onClick={() => setShowForm((v) => !v)}
        >
          <Link2 className="size-3" />
          {showForm ? "Cancelar" : "Generar link"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {showForm && (
          <div className="rounded-lg border border-prism-cyan/30 bg-prism-cyan/5 p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-prism-cyan">
              Nuevo link de cobro
            </p>
            <div className="space-y-2">
              <Input
                placeholder="Email de la clienta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 text-sm"
              />
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="">Selecciona servicio…</option>
                {services?.map((s) => (
                  <option key={s.id.toString()} value={s.name}>
                    {s.name} — {formatClp(Number(s.priceCLP))}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                className="w-full"
                onClick={handleGenerate}
                disabled={isPending || !email || !selectedService}
              >
                {isPending ? (
                  <>
                    <RefreshCw className="mr-1.5 size-3 animate-spin" />
                    Generando…
                  </>
                ) : (
                  <>
                    <Zap className="mr-1.5 size-3" />
                    Generar y copiar link
                  </>
                )}
              </Button>
              <p className="text-center text-[0.65rem] text-amber-600 dark:text-amber-400">
                ⚠ Cuenta Flow pendiente de activación — el link no cobrará hasta que Flow la active
              </p>
            </div>
          </div>
        )}

        {MOCK_FLOW_LINKS.map((link) => (
          <div
            key={link.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{link.client}</p>
              <p className="truncate text-xs text-muted-foreground">{link.service}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-sm text-foreground">{formatClp(link.amount)}</p>
              {link.status === "paid" ? (
                <span className="font-mono text-[0.6rem] text-emerald-500">pagado</span>
              ) : (
                <span className="font-mono text-[0.6rem] text-amber-500">pendiente</span>
              )}
            </div>
          </div>
        ))}
        <p className="text-center font-mono text-[0.6rem] text-muted-foreground">
          datos demo · se reemplazarán cuando Flow esté activo
        </p>
      </CardContent>
    </Card>
  );
}

// ── WhatsApp ──────────────────────────────────────────────────────────────────
const WA_TEMPLATES = [
  {
    label: "Recordar pago",
    msg: "Hola, te recuerdo que tienes un pago pendiente por tu servicio en Liza Espacio Belleza. ¿Necesitas que te reenvíe el link?",
  },
  {
    label: "Confirmar hora",
    msg: "Hola, confirmamos tu hora para mañana en Liza Espacio Belleza. ¿Todo bien?",
  },
  {
    label: "Bienvenida post-servicio",
    msg: "Gracias por tu visita a Liza Espacio Belleza 🌿 ¿Cómo te fue con el tratamiento? Nos encanta saber tu opinión.",
  },
  {
    label: "Reagendar",
    msg: "Hola, vimos que tienes una hora próxima. ¿Necesitas reagendar? Puedes hacerlo en lizaespaciobelleza.cl",
  },
];

function WhatsAppSection() {
  return (
    <Card className="border-border bg-card shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base text-foreground">
          WhatsApp rápido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {WA_TEMPLATES.map((t) => (
          <a
            key={t.label}
            href={WA_URL(t.msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-2.5 text-sm transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/5"
          >
            <span className="text-foreground">{t.label}</span>
            <ArrowUpRight className="size-3.5 text-muted-foreground" />
          </a>
        ))}
        <a
          href={WA_URL()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
        >
          <MessageCircle className="size-3.5" />
          Abrir WhatsApp Business
        </a>
      </CardContent>
    </Card>
  );
}

// ── Instagram ─────────────────────────────────────────────────────────────────
function InstagramSection({ data }: { data: InstagramData | undefined }) {
  if (!data?.connected) {
    return (
      <Card className="border-border bg-card shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-base text-foreground">
              Instagram
            </CardTitle>
            <Instagram className="size-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ConnectBadge label="Sin conectar" />
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Agrega <span className="font-mono">INSTAGRAM_ACCESS_TOKEN</span> en
            Vercel para ver métricas reales.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 opacity-40 select-none">
            <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
              <p className="font-display text-xl">1.2k</p>
              <p className="font-mono text-[0.6rem] text-muted-foreground">seguidores</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
              <p className="font-display text-xl">340</p>
              <p className="font-mono text-[0.6rem] text-muted-foreground">alcance / sem.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-base text-foreground">
            @{data.username}
          </CardTitle>
          <Instagram className="size-4 text-prism-rose" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
            <p className="font-display text-xl text-foreground">
              {(data.followers ?? 0).toLocaleString("es-CL")}
            </p>
            <p className="font-mono text-[0.6rem] text-muted-foreground">seguidores</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
            <p className="font-display text-xl text-foreground">{data.postCount}</p>
            <p className="font-mono text-[0.6rem] text-muted-foreground">posts</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Heart className="size-3 text-prism-rose" />
              <p className="font-display text-xl text-foreground">{data.recentLikes}</p>
            </div>
            <p className="font-mono text-[0.6rem] text-muted-foreground">likes recientes</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <MessageCircle className="size-3 text-prism-violet" />
              <p className="font-display text-xl text-foreground">{data.recentComments}</p>
            </div>
            <p className="font-mono text-[0.6rem] text-muted-foreground">comentarios</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Conexiones ────────────────────────────────────────────────────────────────
const CONEXIONES = [
  { label: "Flow Chile", key: "flow", note: "Cuenta en revisión — código listo" },
  { label: "Shopify Admin API", key: "shopify", note: "SHOPIFY_ADMIN_TOKEN + SHOPIFY_STORE_DOMAIN" },
  { label: "Instagram Graph API", key: "instagram", note: "INSTAGRAM_ACCESS_TOKEN" },
  { label: "Gmail (correo Liza)", key: "gmail", note: "Autorizar cuenta correcta" },
  { label: "Appointly embed", key: "appointly", note: "Código embed de Shopify Admin" },
  { label: "WhatsApp API", key: "whatsapp", note: "Twilio · $8 USD/mes · opcional" },
] as const;

function ConexionesSection({ shopifyOk, instagramOk }: { shopifyOk: boolean; instagramOk: boolean }) {
  const statusMap: Record<string, boolean> = {
    flow: false,
    shopify: shopifyOk,
    instagram: instagramOk,
    gmail: false,
    appointly: false,
    whatsapp: false,
  };

  return (
    <Card className="border-border bg-card shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-base text-foreground">
          <Sparkles className="size-4 text-prism-cyan" />
          Estado de conexiones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {CONEXIONES.map((c) => {
          const ok = statusMap[c.key];
          return (
            <div
              key={c.key}
              className="flex items-start gap-3 rounded-lg border border-border bg-muted/10 px-3 py-2.5"
            >
              {ok ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              ) : (
                <XCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
              )}
              <div className="min-w-0">
                <p className={`text-xs font-medium ${ok ? "text-foreground" : "text-muted-foreground"}`}>
                  {c.label}
                </p>
                {!ok && (
                  <p className="mt-0.5 text-[0.6rem] text-muted-foreground/70">{c.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// re-export type for internal use
type InstagramData = ReturnType<typeof useInstagramMetrics>["data"];
