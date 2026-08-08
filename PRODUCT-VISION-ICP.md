# Visión de producto — ideas nacidas del trabajo en Liza

> **Estado: 💭 Ideas, sin código, sin decisión de avanzar.** Este documento existe para no perder el hilo, no es un compromiso de trabajo. Vive separado de `AGENTS.md`, `APPS.md` y `RISKS.md` porque esos son operativos del negocio de Liza — esto son ideas de producto distintas, que hoy están integradas al trabajo de Liza pero podrían volverse independientes.
>
> Nombres de trabajo: sin definir. Renombrar cuando haya nombre.

---

## Idea 1 — SaaS de agenda/pagos para clínicas (vertical, sobre ICP)

### Concepto

Lo que construimos para Liza — dashboard operativo, agenda por trabajador, generador de links de pago, login por roles — no tiene nada de específico a un spa de belleza en su mecánica. Cualquier negocio de servicios con reservas (clínica estética, consultorio, barbería, kinesiología, etc.) tiene el mismo problema: agenda + cobro + panel operativo simple. Esto podría ser un producto que otras clínicas usen, no solo una herramienta interna de Liza.

### Por qué encaja mejor con ICP que la versión actual de Liza

Para Liza sola, ICP era "nice to have" — resolvía riesgos puntuales (login, hosting) pero no era imprescindible. Para un producto multi-cliente, varias piezas de ICP dejan de ser opcionales y empiezan a resolver problemas reales de escalar:

- **Internet Identity resuelve lo que no escala hoy.** El esquema actual de Liza (4 contraseñas nombradas en variables de Vercel) funciona para una clínica. No funciona para N clínicas — no vas a estar gestionando contraseñas a mano por cada negocio nuevo. Internet Identity le da a cada persona (dueño de clínica, trabajadora) una identidad ligada a su dispositivo, sin que el operador de la plataforma tenga que administrar credenciales de nadie.
- **Modelo de costos por cycles.** En vez de una factura de hosting que crece con cada cliente nuevo (como pasaría en Vercel/AWS), el consumo se paga por cómputo real usado.
- **Aislamiento de datos entre clínicas más natural.** Un canister por tenant (o un esquema multi-tenant dentro de un canister) separa los datos de cada clínica sin construir esa lógica de aislamiento a mano en una base de datos compartida.
- **Ángulo de marketing real, no solo técnico.** "Agenda verificable, no manipulable" o "el primer sistema operativo Web3 para clínicas en Chile" es un diferenciador de producto más creíble en un SaaS que se vende a otros negocios, que en la web de un solo spa.

### Lo que ICP NO resuelve (honestidad, no venta de humo)

- El valor es para el **operador de la plataforma** y para las **clínicas-cliente** (más simple de administrar). No es un value prop directo para los pacientes/clientas finales.
- No resuelve adopción de pagos cripto por parte de clientes finales.
- No es gratis de construir ni mantener — sigue siendo un producto real que alguien tiene que operar.

### Qué falta para que sea real

- [ ] Definir modelo de multi-tenancy: ¿un canister por clínica, o un esquema multi-tenant dentro de uno solo?
- [ ] Internet Identity integrado, reemplazando el esquema de contraseñas nombradas
- [ ] Branding configurable por tenant (hoy todo el diseño está hardcodeado para Liza — ver `DESIGN.md`)
- [ ] Cada clínica con su propia integración de pagos (Flow u otro proveedor por tenant)
- [ ] Modelo de negocio: ¿suscripción mensual, comisión por transacción, freemium?
- [ ] Deploy de un canister real — hoy no existe ninguno desplegado, ni para Liza ni para esto

---

## Idea 2 — Dashboard conector de APIs para PyMEs (horizontal, cualquier rubro)

### Concepto

Distinta de la Idea 1: esa era vertical (lógica específica de agenda/reservas). Esta es horizontal — el valor no es la lógica de un rubro, es **agregar las APIs de negocio dispersas en una sola vista con login por roles**. Cualquier PyME con Shopify + Instagram + WhatsApp + un gateway de pago + Gmail tiene el mismo problema que describiste al pedir el dashboard de Liza: "reemplazar 6 ventanas de navegador." Sirve para un restorán, una tienda de ropa, un gimnasio — no solo negocios con reservas.

### Relación con el trabajo actual

Hoy está 100% integrado al proyecto de Liza — es literalmente `src/frontend/src/pages/Dashboard.tsx` y sus edge functions. No es un producto separado todavía. Podría volverse independiente el día que se generalice: sacar lo específico de Liza (nombres de trabajadoras, servicios) y volverlo configurable por negocio.

### Honestidad sobre el mercado

Este espacio no está vacío. Existen herramientas ya resolviendo "conectar tus apps de negocio en un panel" (Zapier y sus interfaces, varias herramientas de "command center" para PyMEs). No es un océano azul. La diferenciación posible:
- **Simplicidad radical** para un dueño no técnico de un solo local — no requiere configurar flujos como Zapier, viene con integraciones pre-armadas
- **Integraciones específicas para el stack chileno típico** (Flow/Webpay, Shopify, WhatsApp) que herramientas globales genéricas no priorizan
- El ángulo ICP de la Idea 1 (login sin contraseñas por administrar, costos por uso) también aplicaría acá si se combinan

### Cómo se relaciona con la Idea 1

Podrían ser el mismo producto en capas (el dashboard conector como base horizontal, con un módulo de agenda/reservas específico para clínicas encima) o dos productos separados. No hay que decidir esto ahora — ambas ideas nacieron de la misma sesión de trabajo y comparten arquitectura base.

---

## Qué se reutiliza de Liza (aplica a ambas ideas)

- Patrón de dashboard con roles (admin/worker) — `src/frontend/api/_lib/session.ts`, `Dashboard.tsx`
- Generador de links de pago — `useFlowPayment.ts`
- Estructura de datos de servicios/agenda/combos — `mocks/backend.ts` (hoy hardcodeado para Liza, tendría que volverse configurable por tenant)

Liza sería, en cualquiera de los dos escenarios, el primer caso de uso real sobre el que ya se está construyendo y probando.

## Próximo paso si esto avanza

Nada por ahora. Si en algún momento se decide perseguir cualquiera de las dos ideas en serio, el primer paso sería separar el concepto de este repositorio (que es específicamente el negocio de Liza) hacia uno propio, y recién ahí empezar a diseñar la arquitectura multi-tenant desde cero.
