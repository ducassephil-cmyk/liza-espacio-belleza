# Project Guidance — Liza Espacio Belleza

## Contexto General

Frontend React + Vite + TypeScript + Tailwind + TanStack Router/Query + Radix UI.
Generado por Caffeine (ICP/Motoko). Sin canister real desplegado — usa `mockBackend` como fallback.
Deploy en Vercel (auto-deploy activo vía GitHub push). Web principal en Shopify: lizaespaciobelleza.cl.

**URL Vercel actual:** https://liza-espacio-belleza-frontend-f5vt5lhkv-pegassus.vercel.app
**Repo GitHub:** git@github.com:ducassephil-cmyk/liza-espacio-belleza.git
**Ver todas las apps y sus responsabilidades:** `APPS.md`

## Arquitectura

- **Shopify** → web principal, booking live (Appointly), e-commerce
- **Vercel** → nuevo frontend React, Edge Functions (Flow), auto-deploy desde GitHub `main`
- **ICP (futuro)** → automatización de agendas con canister Motoko + vUSD
- **Flow Chile** → pasarela de pagos online (vars en Vercel, cuenta producción pendiente de activación)

## Estado Actual — Completado ✓

- Workers: solo Nersa (faciales/masajes) y Jennifer (masajes) en `mocks/backend.ts`
- Partners: solo Flow en `mocks/backend.ts`
- Sección "Protocolo" → texto de reclutamiento plain en `Home.tsx`
- Hero video 15% más grande (`max-w-2xl`)
- Botones agenda → `lizaespaciobelleza.cl`
- WhatsApp FAB fijo bottom-right en `Layout.tsx`
- `WA_URL` y `WA_NUMBER` exportados desde `Layout.tsx`
- Stats band (4 cifras) en `Home.tsx` entre Hero y EspacioSection
- Botón WhatsApp por servicio en `Servicios.tsx` (mensaje pre-llenado con nombre y precio)
- Botón "Pagar con Flow" por servicio con input de email en `Servicios.tsx`
- Badge de cupos disponibles en cards de servicios (`Servicios.tsx`)
- Hook `useFlowPayment` en `hooks/useFlowPayment.ts`
- Edge function `api/flow-create-order.ts` (HMAC-SHA256, sandbox/producción)
- Webhook `api/flow-confirm.ts` (confirma pago en Flow)
- Página `/pago-exitoso` con CTA WhatsApp (`pages/PagoExitoso.tsx`)
- Ruta `/pago-exitoso` registrada en `App.tsx`
- **Fix crítico:** `useQueries.ts` — `resolveActor()` + mock fallback + `enabled: true`. Sin este fix los servicios nunca cargan.
- **Fix visual:** `BlackGlassButton.tsx` — tailwind-merge tiraba `bg-glass`; hover movido a CSS (`.bg-glass:hover` en `index.css`)
- **Fix animaciones mobile:** `SectionReveal.tsx` — `whileInView` reemplazado por `useInView` hook (RAF se pausa con `document.hidden=true` en preview)
- **Auto-deploy:** Vercel conectado a GitHub `main`. Cada push despliega automáticamente.
- **Dashboard operacional:** mockup completo publicado como Artifact (Flow, WA, IG, Gmail, Equipo, KPIs)
- **Documentación:** `APPS.md` con mapa de todas las plataformas, responsabilidades y prioridades

## Variables de Entorno Vercel — Estado Actual

| Key | Estado | Notas |
|-----|--------|-------|
| `FLOW_API_KEY` | ✅ Configurada | API key de producción de Flow |
| `FLOW_SECRET_KEY` | ✅ Configurada | Secret key de producción de Flow |
| `FLOW_ENV` | ✅ `production` | Apunta a producción; cuenta pendiente de activación por Flow |
| `SITE_URL` | ✅ Configurada | URL actual de Vercel |

> **Nota:** Flow devuelve "token unexpected" porque la cuenta de producción aún no está activada por Flow Chile.
> El código está correcto. Cuando Flow active la cuenta, los pagos funcionarán sin cambios adicionales.

## Pendiente — Funcionalidades

- [ ] **Flow producción**: esperar activación de cuenta por Flow Chile (sin acción de código)
- [ ] **Test Flow completo**: probar servicio → email → link → pago → `/pago-exitoso` una vez activa la cuenta
- [ ] **Appointly embed**: modal de reservas inline en `/servicios`. Necesita código embed de Shopify Admin → Apps → Appointly
- [ ] **Formspree**: conectar formulario `/unete` a email. Philippe crea cuenta en formspree.io → pasa el formId
- [ ] **Combos reales**: reemplazar datos mock con nombre, precio y servicios reales de Liza
- [ ] **Productos reales**: actualizar lista desde Shopify (precios, nombres, descripcion)
- [ ] **URLs por servicio**: verificar si Appointly permite links por servicio; si sí, reemplazar `lizaespaciobelleza.cl`
- [ ] **Subdominio**: configurar `app.lizaespaciobelleza.cl` → Vercel en DNS de Shopify
- [ ] **Instagram API**: conectar métricas reales al dashboard (Philippe crea Facebook App)
- [ ] **Shopify Admin API**: token para leer ventas/reservas en dashboard (Philippe genera en Shopify Admin)
- [ ] **Gmail correo Liza**: conectar el correo correcto del negocio (no Lagregochilena@gmail.com)
- [ ] **Test mobile real**: verificar animaciones y layout en iPhone físico
- [ ] **ICP canister**: deployment real para automatización de agendas (largo plazo)

## Reglas Críticas

- **NUNCA** modificar `/dcss/neo-protocol` desde este proyecto
- **NUNCA** abrir la pestaña 🔐CREDENCIALES del Excel
- **NUNCA** modificar el tema live de Shopify sin aprobación explícita del founder
- **NUNCA** copiar que el salón acepta walk-ins (es solo por reserva)
- Gmail conectado a `Lagregochilena@gmail.com` — NO es el correo de Liza, no leer/enviar emails de clientes

## Verified Commands

**Frontend** (desde `src/frontend/`):
- install: `pnpm install --prefer-offline`
- typecheck: `pnpm typecheck`
- lint fix: `pnpm fix`
- build: `pnpm build`

**Git / Deploy:**
- Remote SSH: `git@github.com:ducassephil-cmyk/liza-espacio-belleza.git`
- Push → Vercel redeploy automático
- Ver deployments: `npx vercel ls`

**Backend** (desde `src/backend/`):
- install: `mops install`
- typecheck: `mops check --fix`
- build: `mops build`
- generate bindings (root): `pnpm bindgen`
