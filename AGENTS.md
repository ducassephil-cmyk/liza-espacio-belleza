# Project Guidance — Liza Espacio Belleza

## Contexto General

Frontend React + Vite + TypeScript + Tailwind + TanStack Router/Query + Radix UI.
Generado por Caffeine (ICP/Motoko). Sin canister real desplegado — usa `mockBackend` como fallback.
Deploy en Vercel (auto-deploy activo vía GitHub push). Web principal en Shopify: lizaespaciobelleza.cl.

**URL Vercel fija (usar siempre esta, no la de hash del deploy):** https://liza-espacio-belleza-frontend.vercel.app
**Dashboard:** https://liza-espacio-belleza-frontend.vercel.app/dashboard

> Cada deploy genera una URL única con hash (ej. `-8jqfwrz9j-`). Esa URL cambia en cada push — nunca compartirla como referencia fija. El dominio de arriba sin hash es el alias estable que Vercel mantiene apuntando siempre al último deploy de producción.
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
- **Dashboard operacional:** página real en `/dashboard` (Flow, WA, IG, agenda, KPIs, estado de conexiones) — no es mockup, es la app
- **Login del dashboard:** 4 passwords nombradas (no una compartida) + cookie de sesión firmada (HMAC). Ver `api/_lib/session.ts`
- **Roles del dashboard:** `admin` (Philippe, socio) ve todo — KPIs, agenda completa, Shopify, Instagram, conexiones. `worker` (Nersa, Jennifer) ve solo su propia agenda + generador de links Flow (pueden generar cobros, el dinero igual entra a la cuenta Flow del negocio, no a ellas)
- **Documentación:** `APPS.md` con mapa de todas las plataformas, responsabilidades y prioridades

## Variables de Entorno Vercel — Estado Actual

| Key | Estado | Notas |
|-----|--------|-------|
| `FLOW_API_KEY` | ✅ Configurada | API key de producción de Flow |
| `FLOW_SECRET_KEY` | ✅ Configurada | Secret key de producción de Flow |
| `FLOW_ENV` | ✅ `production` | Apunta a producción; cuenta pendiente de activación por Flow |
| `SITE_URL` | ✅ Configurada | URL actual de Vercel |
| `DASHBOARD_PASSWORD_PHILIPPE` | ⚪ Falta agregar | Contraseña de Philippe (admin) — nombre de variable nuevo, distinto al `DASHBOARD_PASSWORD` original |
| `DASHBOARD_PASSWORD_SOCIO` | ⚪ Falta agregar | Contraseña del socio (admin) |
| `DASHBOARD_PASSWORD_NERSA` | ⚪ Falta agregar | Contraseña de Nersa (worker — solo ve su agenda + Flow) |
| `DASHBOARD_PASSWORD_JENNIFER` | ⚪ Falta agregar | Contraseña de Jennifer (worker — solo ve su agenda + Flow) |
| `DASHBOARD_SESSION_SECRET` | ✅ Configurada | Secreto random que firma la cookie de sesión (`openssl rand -hex 32`) — no cambia, se reutiliza |
| `SHOPIFY_ADMIN_TOKEN` | ⚪ Falta agregar | Token de Shopify Admin API (ver `APPS.md`) |
| `SHOPIFY_STORE_DOMAIN` | ⚪ Falta agregar | Ej. `liza-espacio-belleza.myshopify.com` |
| `INSTAGRAM_ACCESS_TOKEN` | ⚪ Falta agregar | Token de Instagram Graph API (ver `APPS.md`) |

> **Nota Flow:** devuelve "token unexpected" porque la cuenta de producción aún no está activada por Flow Chile.
> El código está correcto. Cuando Flow active la cuenta, los pagos funcionarán sin cambios adicionales.

> **Nota Dashboard:** la variable `DASHBOARD_PASSWORD` (singular, sin sufijo) que se usó al principio **ya no se lee** — el código ahora compara contra las 4 variables `DASHBOARD_PASSWORD_<NOMBRE>`. Se puede borrar de Vercel, no rompe nada si se deja. El nombre de usuario (`user.id`, ej. `"nersa"`) que determina el rol viene fijo en `api/_lib/session.ts` — si se agrega una tercera trabajadora hay que agregarla ahí también, no solo en Vercel.

## Pendiente — Funcionalidades

- [ ] **Activar accesos faltantes**: Philippe agrega `DASHBOARD_PASSWORD_SOCIO`, `DASHBOARD_PASSWORD_NERSA`, `DASHBOARD_PASSWORD_JENNIFER` en Vercel (cada una la elige él o la persona)
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
