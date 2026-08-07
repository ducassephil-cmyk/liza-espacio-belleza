# Apps & Plataformas — Liza Espacio Belleza

Registro de todas las plataformas que componen la nueva web de Liza.
Cada entrada indica el rol, estado actual, quién activa la conexión, y qué hace falta.

> **Referencia cruzada:** ver `AGENTS.md` para detalles técnicos de cada integración,
> y `DESIGN.md` para el sistema visual.

---

## Mapa general

```
Cliente
  │
  ├─ lizaespaciobelleza.cl (Shopify) ─── Appointly (reservas) ─── Gmail
  │
  └─ app.lizaespaciobelleza.cl (Vercel) ── React App (nuevo frontend)
       │
       ├─ Flow Chile ──────────────── pagos online
       ├─ WhatsApp Business API ───── mensajes de clientes
       ├─ Instagram / Meta API ────── métricas marketing
       ├─ ICP / Canister (futuro) ─── automatización agenda + vUSD
       └─ Claude (Anthropic) ──────── asistente de desarrollo
```

---

## Resumen de plataformas

| Plataforma | Rol | Estado | Activa la conexión | Urgencia |
|---|---|---|---|---|
| **Vercel** | Hosting del nuevo frontend React | ✅ Activo | Philippe + Claude | — |
| **GitHub** | Repositorio de código | ✅ Activo | Philippe | — |
| **Shopify** | Web principal + e-commerce + Appointly | ✅ Activo | Philippe (admin) | — |
| **Appointly** | Reservas online en Shopify | ✅ Activo en Shopify | Philippe | Embed en React pendiente |
| **Flow Chile** | Pasarela de pagos (links de cobro) | 🟡 Pendiente activación | Flow activa la cuenta | Alta |
| **WhatsApp Business** | Mensajes de clientes | ⚪ Manual (sin API) | Twilio / Meta + Philippe | Media |
| **Instagram / Meta** | Métricas + publicidad | ⚪ Sin conectar a React | Philippe crea Facebook App | Media |
| **Gmail** | Correo del negocio | ⚪ Sin conectar (cuenta incorrecta) | Philippe autoriza cuenta Liza | Media |
| **ICP (Internet Computer)** | Canister Motoko para agenda automática + vUSD | 🔵 Futuro (mock activo) | Equipo dev (Claude) | Largo plazo |
| **vUSD (DeFi)** | Pago en stablecoin Web3 | 🔵 Demo en mock | Requiere canister ICP real | Largo plazo |
| **Claude (Anthropic)** | Asistente de desarrollo | ✅ Activo en sesiones | Philippe abre sesión | — |
| **Formspree** | Formulario /únete → email | ⚪ Sin conectar | Philippe crea cuenta | Baja |
| **Dominio lizaespaciobelleza.cl** | DNS principal | ✅ Activo en Shopify | — | — |
| **app.lizaespaciobelleza.cl** | Subdominio para el React app | ⚪ Sin configurar | Philippe en Shopify DNS | Baja |

---

## Detalle por plataforma

### Vercel
- **Rol:** Despliega y sirve el frontend React (nuevo). Corre las Edge Functions (Flow, futuros webhooks).
- **URL actual:** `https://liza-espacio-belleza-frontend-f5vt5lhkv-pegassus.vercel.app`
- **Variables de entorno activas:** `FLOW_API_KEY`, `FLOW_SECRET_KEY`, `FLOW_ENV`, `SITE_URL`
- **Deploy:** automático al hacer push a `main` en GitHub.
- **Responsabilidad Claude:** modificar código, revisar build logs, agregar variables.
- **Responsabilidad Philippe:** aprobar deploys, agregar variables secretas en el panel de Vercel.

### GitHub
- **Rol:** Control de versiones. Fuente de verdad del código.
- **Repo:** `git@github.com:ducassephil-cmyk/liza-espacio-belleza.git`
- **Acceso SSH configurado** en el equipo de Philippe.
- **Responsabilidad Claude:** commits, revisión de código, pull requests.
- **Responsabilidad Philippe:** push a `main` (o aprobar PR si se usa esa modalidad).

### Shopify
- **Rol:** Web principal pública (`lizaespaciobelleza.cl`), catálogo, e-commerce, y Appointly.
- **Regla crítica:** NUNCA modificar el tema live de Shopify sin aprobación explícita de Philippe.
- **Responsabilidad Claude:** leer la Admin API para traer datos (productos, ventas) al dashboard.
- **Responsabilidad Philippe:** generar el token de Admin API (`Admin → Apps → Develop apps`), instalar apps, configurar Appointly.
- **Para conectar al dashboard:** Philippe genera un token de acceso en Shopify Admin → el código lo usa para leer ventas y reservas.

### Appointly
- **Rol:** Sistema de reservas online integrado en Shopify.
- **Estado en Shopify:** activo.
- **Pendiente:** insertar el widget de Appointly dentro del React app (modal inline en `/servicios`).
- **Responsabilidad Philippe:** copiar el código embed desde Shopify Admin → Apps → Appointly.
- **Responsabilidad Claude:** insertar el embed en el componente React correcto.

### Flow Chile
- **Rol:** Pasarela de pagos online. Philippe genera un link de cobro por servicio, lo envía por WhatsApp, la cliente paga online.
- **Estado:** código 100% listo (Edge Function en Vercel). Cuenta de producción pendiente de activación por parte de Flow.
- **Sandbox:** funciona. Producción: Flow debe activar la cuenta manualmente.
- **Responsabilidad Philippe:** responder a Flow si piden documentación adicional, cambiar `FLOW_ENV=production` cuando confirmen.
- **Responsabilidad Claude:** nada pendiente en código. Mantenimiento si cambia la API.

### WhatsApp Business API
- **Rol:** Recibir mensajes de clientes directamente en el dashboard (sin abrir el celular).
- **Estado:** hoy solo funciona como link `wa.me/` (abre el teléfono). No hay API conectada.
- **Para conectar:** registrar un número dedicado de empresa en Meta Business → activar WhatsApp Business API → usar un proveedor como Twilio o Meta directamente.
- **Costo:** ~$8 USD/mes (Twilio) o costo por mensaje (Meta directo).
- **Responsabilidad Philippe:** crear cuenta en Meta Business Manager, registrar número, contratar Twilio si se elige esa ruta.
- **Responsabilidad Claude:** integrar la API en el backend y el dashboard.
- **Alternativa sin API:** seguir usando el celular manualmente. El dashboard muestra los contactos pero no los mensajes en tiempo real.

### Instagram / Meta Ads API
- **Rol:** Traer métricas reales de Instagram (seguidores, alcance, interacciones) y estado de campañas pagadas.
- **Estado:** datos del dashboard son placeholder. No hay conexión real.
- **Para conectar:**
  1. Philippe inicia sesión en [Meta for Developers](https://developers.facebook.com)
  2. Crea una app del tipo "Business"
  3. Agrega el producto "Instagram Graph API"
  4. Conecta el perfil de Instagram de Liza
  5. Genera un token de acceso de larga duración
  6. Philippe pasa ese token a Claude → se guarda en Vercel como variable de entorno
- **Responsabilidad Philippe:** pasos 1–5 (requiere ser admin del perfil de Instagram de Liza).
- **Responsabilidad Claude:** escribir la función que llama a la API y alimenta el dashboard.

### Gmail
- **Rol:** Ver correos de reservas del negocio (notificaciones de bigbox) en el dashboard.
- **Estado:** Gmail MCP conectado a `Lagregochilena@gmail.com` — autorizado por Philippe (2026-08-07) como cuenta de prueba, ya que es la que efectivamente recibe las notificaciones de reservas vía bigbox.
- **Precaución:** al leer, filtrar solo correos relacionados a reservas/bigbox — no mostrar correspondencia personal no relacionada al negocio. No enviar correos desde esta cuenta sin instrucción explícita de Philippe en la sesión.
- **A futuro:** evaluar si conviene migrar a un correo dedicado 100% al negocio de Liza.
- **Responsabilidad Philippe:** decidir cuándo migrar a un correo dedicado, si aplica.
- **Responsabilidad Claude:** filtrar solo emails relevantes a reservas. Nunca leer o escribir fuera de eso sin instrucción explícita.

### ICP (Internet Computer Protocol) — Canister Motoko
- **Rol (futuro):** automatización de agenda, lógica de negocio on-chain, emisión de vUSD.
- **Estado:** sin canister desplegado. El frontend usa `mockBackend` como fallback completo.
- **Impacto en producción:** ninguno hoy — la web funciona con el mock.
- **Para activar:** deploy del canister Motoko a la red ICP (mainnet). Requiere ICP tokens para cycles.
- **Responsabilidad Claude:** código del canister ya existe en `src/backend/`. Ejecutar `mops build` + deploy cuando Philippe lo indique.
- **Responsabilidad Philippe:** tener cycles ICP disponibles, aprobar el deploy.

### vUSD (DeFi — stablecoin sintético)
- **Rol:** permitir a clientes pagar con vUSD (1 vUSD = 1 USD ≈ 950 CLP) vía la interfaz web3.
- **Estado:** demo completo en el mock. El botón "Pagar con vUSD" funciona pero no mueve dinero real.
- **Depende de:** canister ICP activo (ver arriba).
- **Responsabilidad Philippe:** confirmar si este flujo se activa antes o después del ICP real.

### Claude (Anthropic)
- **Rol:** asistente de desarrollo de todo el proyecto. Escribe código, depura, diseña, documenta.
- **Sesiones activas:** a través de Claude.ai / Claude Code (CLI).
- **No tiene acceso autónomo** a Vercel, GitHub, ni producción — todo cambio requiere aprobación de Philippe en la sesión.
- **Lo que sí puede hacer:** leer y modificar código local, sugerir deploys, revisar logs de Vercel, conectar APIs cuando Philippe provee las claves.
- **Lo que NO hace:** guardar claves en el historial de chat, modificar Shopify sin aprobación, leer correspondencia personal no relacionada a reservas en Lagregochilena@gmail.com, abrir el archivo 🔐CREDENCIALES.

### Formspree
- **Rol:** recibir el formulario de postulación de `/únete` y enviar el email a Philippe.
- **Estado:** formulario existe en el código pero no envía nada.
- **Para conectar:** Philippe crea cuenta gratuita en formspree.io → copia el `formId` → Claude lo inserta en el componente.
- **Tiempo estimado:** 10 minutos.

---

## Prioridad de conexiones

| Orden | Plataforma | Qué desbloquea | Quién actúa primero |
|---|---|---|---|
| 1 | **Flow producción** | cobros reales online | Flow Chile activa la cuenta |
| 2 | **Shopify Admin API** | ventas y reservas en dashboard | Philippe genera el token |
| 3 | **Formspree** | formulario /únete funcional | Philippe crea cuenta (10 min) |
| 4 | **Instagram API** | métricas reales en dashboard | Philippe crea app en Meta |
| 5 | **Gmail correo de Liza** | emails del negocio en dashboard | Philippe confirma la cuenta |
| 6 | **Appointly embed** | reservas inline en React | Philippe copia el embed |
| 7 | **Subdominio app.liza** | URL limpia para la nueva web | Philippe configura DNS |
| 8 | **WhatsApp API** | mensajes en tiempo real | Philippe contrata Twilio |
| 9 | **ICP canister** | automatización on-chain + vUSD real | equipo dev + cycles ICP |
