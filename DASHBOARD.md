# Dashboard operativo — `/dashboard`

Documento dedicado al dashboard de Liza: qué es, cómo funciona el login, qué ve cada rol, y el registro de cambios. Separado de `AGENTS.md` (proyecto general) para no perder el detalle entre medio de todo lo demás.

**URL:** https://liza-espacio-belleza-frontend.vercel.app/dashboard

## Qué es

El "sistema operativo de negocio" de Philippe — reemplaza abrir Flow, WhatsApp, Instagram, Gmail y Shopify en pestañas separadas. Página real dentro de la app React (no es un mockup), vive en `src/frontend/src/pages/Dashboard.tsx`.

## Arquitectura

- **Auth:** 4 contraseñas nombradas (no una compartida) + cookie de sesión firmada con HMAC, 30 días de expiración. Sin base de datos — todo vive en `api/_lib/session.ts`.
- **Roles:** `admin` y `worker`, definidos en el arreglo `USERS` dentro de `session.ts`.
- **Sesión:** el token guarda el `id` del usuario (ej. `"nersa"`) + expiración, firmado. El rol y nombre para mostrar se resuelven en cada request contra `USERS`, no se guardan en el token — así si se corrige un nombre no hay que invalidar sesiones viejas.

## Usuarios y roles

| Usuario | `id` interno | Rol | Variable de entorno | Qué ve |
|---|---|---|---|---|
| Philippe | `philippe` | admin | `DASHBOARD_PASSWORD_PHILIPPE` | Todo |
| Socio | `socio` | admin | `DASHBOARD_PASSWORD_SOCIO` | Todo |
| Nersa | `nersa` | worker | `DASHBOARD_PASSWORD_NERSA` | Solo su agenda + generador de links Flow |
| Jennifer | `jennifer` | worker | `DASHBOARD_PASSWORD_JENNIFER` | Solo su agenda + generador de links Flow |

**Admin ve:** KPIs (ingresos, clientas del día, links Flow, WhatsApp sin responder), agenda completa de ambas trabajadoras, generador de links Flow, plantillas de WhatsApp, métricas de Instagram, estado de conexiones de todas las plataformas.

**Worker ve:** solo su propia agenda del día + el generador de links Flow (pueden generar cobros — el dinero entra a la cuenta Flow del negocio, no a ellas, así que no hay riesgo en darles ese acceso). No ven ingresos, no ven la agenda de la otra trabajadora, no ven Instagram/Shopify/conexiones.

> Si se agrega una tercera persona (trabajadora nueva, otro admin), hay que agregarla en dos lugares: el arreglo `USERS` en `api/_lib/session.ts` (código) **y** la variable de entorno con su contraseña en Vercel. Agregar solo la variable de entorno no alcanza.

## Endpoints (`src/frontend/api/`)

| Endpoint | Qué hace |
|---|---|
| `dashboard-login.ts` | POST `{password}` → busca coincidencia contra las 4 variables, si matchea crea la cookie de sesión |
| `dashboard-session.ts` | GET → devuelve `{authenticated, user}` según la cookie actual |
| `dashboard-logout.ts` | POST → limpia la cookie |
| `shopify-orders.ts` | Requiere rol `admin`. Sin `SHOPIFY_ADMIN_TOKEN`/`SHOPIFY_STORE_DOMAIN` devuelve `connected: false` |
| `instagram-metrics.ts` | Requiere rol `admin`. Sin `INSTAGRAM_ACCESS_TOKEN` devuelve `connected: false` |
| `_lib/session.ts` | No es un endpoint (prefijo `_` — Vercel lo ignora al armar rutas). Firma/verifica tokens, define `USERS` |

## Variables de entorno necesarias

| Variable | Estado | Nota |
|---|---|---|
| `DASHBOARD_PASSWORD_PHILIPPE` | ⚪ Falta agregar | Nombre nuevo — reemplaza al `DASHBOARD_PASSWORD` original que ya no se lee |
| `DASHBOARD_PASSWORD_SOCIO` | ⚪ Falta agregar | |
| `DASHBOARD_PASSWORD_NERSA` | ⚪ Falta agregar | |
| `DASHBOARD_PASSWORD_JENNIFER` | ⚪ Falta agregar | |
| `DASHBOARD_SESSION_SECRET` | ✅ Configurada | No cambia al agregar nuevos usuarios, se reutiliza |
| `SHOPIFY_ADMIN_TOKEN` + `SHOPIFY_STORE_DOMAIN` | ⚪ Falta agregar | Solo lectura — ver `APPS.md` |
| `INSTAGRAM_ACCESS_TOKEN` | ⚪ Falta agregar | Ver `APPS.md` |

## Pendiente específico del dashboard

- [ ] Agregar las 4 variables de contraseña en Vercel para activar los accesos
- [ ] Conectar Shopify Admin API (KPI de ingresos reales, hoy es dato demo)
- [ ] Conectar Instagram Graph API (métricas reales, hoy es placeholder)
- [ ] Reemplazar `MOCK_AGENDA` y `MOCK_FLOW_LINKS` (hardcodeados en `Dashboard.tsx`) por datos reales cuando exista Appointly embed o canister
- [ ] Evaluar Nivel 1 del plan de monitoreo (`RISKS.md` #8) — alertas si Flow/Shopify/Instagram dejan de responder

## Registro de cambios

### 2026-08-07 — Fix seguridad: generación de links Flow sin control
`api/flow-create-order.ts` no tenía ningún chequeo de autenticación — cualquier visitante anónimo del sitio (o cualquiera con curl/Postman, sin pasar por la web) podía generar links de cobro Flow sin límite. Philippe lo detectó al notar que el botón "Pagar con Flow" público en `Servicios.tsx` permitía a cualquier usuario generar cuantos links quisiera. Corregido: el endpoint ahora exige `getSessionUser(req)` (cualquier rol del dashboard, admin o worker). Se quitó el botón/flujo de auto-servicio de `Servicios.tsx` — el único lugar donde se generan links de Flow ahora es el dashboard, con cada link atribuido a la persona logueada que lo generó. También se deshabilitó (comentado, no borrado) el botón de pago con vUSD en la misma página, por no aplicar todavía.

### 2026-08-07 — Login por roles (admin/worker)
Reemplazado el esquema de 1 contraseña compartida por 4 contraseñas nombradas con roles. Trabajadoras (Nersa, Jennifer) ahora ven solo su agenda + Flow, no el dashboard completo. Requiere las 3 variables nuevas en Vercel (`DASHBOARD_PASSWORD_SOCIO/NERSA/JENNIFER`) — pendiente que Philippe las agregue.

### 2026-08-07 — Fix crítico: crash del login en producción
`api/_lib/session.ts` se importaba sin extensión `.js` (`./_lib/session`) — Node ESM en modo `"type": "module"` exige la extensión explícita en imports relativos. Causaba `FUNCTION_INVOCATION_FAILED` en todos los endpoints de auth; la contraseña nunca llegaba a compararse. Corregido y verificado en producción con `vercel logs`.

### 2026-08-07 — Login con contraseña compartida (versión inicial)
Primera versión del login: 1 password compartida (`DASHBOARD_PASSWORD`) + cookie de sesión firmada HMAC. Reemplazado el mismo día por el esquema de roles de arriba.

### 2026-08-07 — Dashboard real en `/dashboard`
Página completa reemplazando el mockup anterior (Artifact). KPIs, agenda, generador Flow, WhatsApp rápido, Instagram, estado de conexiones. Edge functions `shopify-orders.ts` e `instagram-metrics.ts` creadas, listas para conectar tokens.
