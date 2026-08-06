import { BlackGlassButton } from "@/components/BlackGlassButton";
import { CheckCircle2, Calendar, Home } from "lucide-react";
import { motion } from "motion/react";
import { WA_URL } from "@/components/Layout";

export function PagoExitosoPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-md w-full overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-elevated"
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-[length:200%_100%] animate-prism-shimmer"
          style={{ backgroundImage: "var(--gradient-prism)" }}
        />

        <div className="flex justify-center">
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-success/15">
            <CheckCircle2 className="size-9 text-success" />
          </span>
        </div>

        <h1 className="mt-6 font-display text-3xl text-foreground">
          ¡Pago recibido!
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Tu pago fue procesado correctamente por Flow. En breve recibirás un
          correo de confirmación.
        </p>

        <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            Para confirmar tu hora escríbenos por WhatsApp o espera que te
            contactemos.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <BlackGlassButton size="lg" asChild>
            <a href={WA_URL("Hola, acabo de pagar un servicio y quiero confirmar mi hora.")} target="_blank" rel="noopener noreferrer">
              <Calendar className="size-4" />
              Confirmar hora por WhatsApp
            </a>
          </BlackGlassButton>
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-smooth hover:bg-muted/40"
          >
            <Home className="size-4" />
            Volver al inicio
          </a>
        </div>
      </motion.div>
    </div>
  );
}
