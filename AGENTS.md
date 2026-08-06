# Project Guidance — Liza Espacio Belleza

## Contexto General

Frontend React + Vite + TypeScript + Tailwind + TanStack Router/Query + Radix UI.
Generado por Caffeine (ICP/Motoko). Sin canister real desplegado — usa `mockBackend` como fallback.
Deploy en Vercel (subdominio de prueba). Web principal en Shopify: lizaespaciobelleza.cl.

**URL Vercel actual:** https://liza-espacio-belleza-frontend-2k30ntiq8-pegassus.vercel.app
**Repo GitHub:** git@github.com:ducassephil-cmyk/liza-espacio-belleza.git

## Arquitectura

- **Shopify** → web principal, booking live (Appointly), e-commerce
- **Vercel** → nuevo frontend React, testing y automatización futura
- **ICP (futuro)** → automatización de agendas con canister Motoko
- **Flow Chile** → pasarela de pagos online (sandbox activo, producción pendiente)

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
- Hook `useFlowPayment` en `hooks/useFlowPayment.ts`
- Edge function `api/flow-create-order.ts` (HMAC-SHA256, sandbox/producción)
- Webhook `api/flow-confirm.ts` (confirma pago en Flow)
- Página `/pago-exitoso` con CTA WhatsApp (`pages/PagoExitoso.tsx`)
- Ruta `/pago-exitoso` registrada en `App.tsx`
- **Fix crítico:** `useQueries.ts` — reemplazado `enabled: !!actor && !isFetching` por `resolveActor()` + mock fallback + `enabled: true`. Sin este fix los servicios nunca cargan.

## Pendiente — Variables de Entorno Vercel

Agregar en Vercel Dashboard → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `FLOW_API_KEY` | API key de Flow Chile |
| `FLOW_SECRET_KEY` | Secret key de Flow Chile |
| `FLOW_ENV` | `sandbox` (cambiar a `production` cuando esté listo) |
| `SITE_URL` | URL actual de Vercel |

## Pendiente — Funcionalidades

- [ ] **Appointly embed**: abrir modal de agendas de Shopify inline. Necesita código embed desde Shopify Admin → Apps → Appointly
- [ ] **Formspree**: conectar formulario `/unete` a email. Necesita token desde formspree.io
- [ ] **Combos reales**: reemplazar datos mock con combos reales (nombre, precio, servicios incluidos)
- [ ] **Productos reales**: actualizar lista de productos desde Shopify
- [ ] **URLs por servicio**: si Appointly soporta links por servicio, reemplazar `lizaespaciobelleza.cl`
- [ ] **Flow producción**: cambiar `FLOW_ENV=production` cuando pasen las pruebas sandbox
- [ ] **Test Flow sandbox**: probar flujo completo (servicio → email → Flow → pago-exitoso)
- [ ] **ICP canister**: deployment real para automatización de agendas (largo plazo)
- [ ] **Cupos badge**: mostrar badge de cupos disponibles en cards de servicios

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
