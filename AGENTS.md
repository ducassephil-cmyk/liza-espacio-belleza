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
**Ver detalle completo del dashboard (auth, roles, changelog):** `DASHBOARD.md`

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
- Badge de cupos disponibles en cards de servicios (`Servicios.tsx`)
- Hook `useFlowPayment` en `hooks/useFlowPayment.ts`
- Edge function `api/flow-create-order.ts` (HMAC-SHA256, sandbox/producción, **requiere sesión de dashboard** — ya no público)
- Webhook `api/flow-confirm.ts` (confirma pago en Flow)
- Página `/pago-exitoso` con CTA WhatsApp (`pages/PagoExitoso.tsx`)
- Ruta `/pago-exitoso` registrada en `App.tsx`
- **Fix crítico:** `useQueries.ts` — `resolveActor()` + mock fallback + `enabled: true`. Sin este fix los servicios nunca cargan.
- **Fix visual:** `BlackGlassButton.tsx` — tailwind-merge tiraba `bg-glass`; hover movido a CSS (`.bg-glass:hover` en `index.css`)
- **Fix animaciones mobile:** `SectionReveal.tsx` — `whileInView` reemplazado por `useInView` hook (RAF se pausa con `document.hidden=true` en preview)
- **Fix seguridad:** el botón público "Pagar con Flow" en `Servicios.tsx` generaba links sin límite ni autenticación — quitado del sitio público; ahora solo se genera desde el dashboard (staff logueado). Ver `DASHBOARD.md`
- vUSD deshabilitado en `Servicios.tsx` (comentado, no borrado — no aplica todavía)
- **Auto-deploy:** Vercel conectado a GitHub `main`. Cada push despliega automáticamente.
- **Dashboard operacional:** página real en `/dashboard`, con login por roles. Detalle completo (auth, roles, changelog) en `DASHBOARD.md` — no duplicar aquí
- **Documentación:** `APPS.md` (plataformas), `DASHBOARD.md` (dashboard), `RISKS.md` (riesgos), `PRODUCT-VISION-ICP.md` (ideas de producto futuras)

## Variables de Entorno Vercel — Estado Actual

| Key | Estado | Notas |
|-----|--------|-------|
| `FLOW_API_KEY` | ✅ Configurada | API key de producción de Flow |
| `FLOW_SECRET_KEY` | ✅ Configurada | Secret key de producción de Flow |
| `FLOW_ENV` | ✅ `production` | Apunta a producción; cuenta pendiente de activación por Flow |
| `SITE_URL` | ✅ Configurada | URL actual de Vercel |
| `DASHBOARD_SESSION_SECRET` | ✅ Configurada | Firma la cookie de sesión del dashboard |
| `DASHBOARD_PASSWORD_PHILIPPE/SOCIO/NERSA/JENNIFER` | ⚪ Falta agregar 3 de 4 | Ver detalle completo en `DASHBOARD.md` |
| `SHOPIFY_ADMIN_TOKEN` | ⚪ Falta agregar | Token de Shopify Admin API (ver `APPS.md`) |
| `SHOPIFY_STORE_DOMAIN` | ⚪ Falta agregar | Ej. `liza-espacio-belleza.myshopify.com` |
| `INSTAGRAM_ACCESS_TOKEN` | ⚪ Falta agregar | Token de Instagram Graph API (ver `APPS.md`) |

> **Nota Flow:** devuelve "token unexpected" porque la cuenta de producción aún no está activada por Flow Chile.
> El código está correcto. Cuando Flow active la cuenta, los pagos funcionarán sin cambios adicionales.

## Pendiente — Funcionalidades

- [ ] **Activar accesos faltantes del dashboard**: ver `DASHBOARD.md` para las 3 variables pendientes
- [ ] **Flow producción**: esperar activación de cuenta por Flow Chile (sin acción de código)
- [ ] **Test Flow completo**: probar servicio → email → link → pago → `/pago-exitoso` una vez activa la cuenta
- [x] **Plan actual de Appointly confirmado**: Shopify $27 USD/mes (vs. $9 sin agenda) — $18/mes extra. Fresha (~$30/mes) no es más barato. Cal.com (gratis) sería la única alternativa con ahorro real, pero requiere desacoplar reservas de Shopify por completo — ver `APPS.md`
- [ ] **Preguntar a Flow si se puede usar tarifa de transferencia (~0,99%)** en vez de tarjeta (~2,9%) — posible ahorro sin cambiar de proveedor (ver `APPS.md`)
- [ ] **Appointly embed**: modal de reservas inline en `/servicios`. Necesita código embed de Shopify Admin → Apps → Appointly
- [ ] **Formspree**: conectar formulario `/unete` a email. Philippe crea cuenta en formspree.io → pasa el formId
- [ ] **Combos reales**: reemplazar datos mock con nombre, precio y servicios reales de Liza
- [ ] **Productos reales**: actualizar lista desde Shopify (precios, nombres, descripcion)
- [ ] **URLs por servicio**: verificar si Appointly permite links por servicio; si sí, reemplazar `lizaespaciobelleza.cl`
- [ ] **Subdominio**: configurar `app.lizaespaciobelleza.cl` → Vercel en DNS de Shopify
- [ ] **Instagram API**: conectar métricas reales al dashboard (Philippe crea Facebook App)
- [ ] **Shopify Admin API**: token para leer ventas/reservas en dashboard (Philippe genera en Shopify Admin)
- [ ] **Gmail correo Liza**: usar `Lagregochilena@gmail.com` como cuenta de prueba (recibe reservas reales vía bigbox — autorizado 2026-08-07); evaluar más adelante si conviene un correo dedicado al negocio
- [ ] **Test mobile real**: verificar animaciones y layout en iPhone físico
- [ ] **ICP canister**: deployment real para automatización de agendas (largo plazo)

## Reglas Críticas

- **NUNCA** modificar `/dcss/neo-protocol` desde este proyecto
- **NUNCA** abrir la pestaña 🔐CREDENCIALES del Excel
- **NUNCA** modificar el tema live de Shopify sin aprobación explícita del founder
- **NUNCA** copiar que el salón acepta walk-ins (es solo por reserva)
- Gmail conectado a `Lagregochilena@gmail.com` — autorizado como cuenta de prueba (recibe reservas reales vía bigbox). Al leer, filtrar solo lo relacionado a reservas/bigbox; no mostrar correspondencia personal no relacionada al negocio; no enviar correos desde ahí sin pedido explícito de Philippe en la sesión

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
