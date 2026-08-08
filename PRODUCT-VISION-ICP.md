# Visión de producto — SaaS de agenda/pagos para clínicas, sobre ICP

> **Estado: 💭 Idea, sin código, sin decisión de avanzar.** Este documento existe para no perder el hilo, no es un compromiso de trabajo. Vive separado de `AGENTS.md`, `APPS.md` y `RISKS.md` porque esos son operativos del negocio de Liza — esto es una idea de producto distinta.
>
> Nombre de trabajo: sin definir. Renombrar el archivo cuando haya nombre.

## Concepto

Lo que construimos para Liza — dashboard operativo, agenda por trabajador, generador de links de pago, login por roles — no tiene nada de específico a un spa de belleza en su mecánica. Cualquier negocio de servicios con reservas (clínica estética, consultorio, barbería, kinesiología, etc.) tiene el mismo problema: agenda + cobro + panel operativo simple. Esto podría ser un producto que otras clínicas usen, no solo una herramienta interna de Liza.

## Por qué encaja mejor con ICP que la versión actual de Liza

Para Liza sola, ICP era "nice to have" — resolvía riesgos puntuales (login, hosting) pero no era imprescindible. Para un producto multi-cliente, varias piezas de ICP dejan de ser opcionales y empiezan a resolver problemas reales de escalar:

- **Internet Identity resuelve lo que no escala hoy.** El esquema actual de Liza (4 contraseñas nombradas en variables de Vercel) funciona para una clínica. No funciona para N clínicas — no vas a estar gestionando contraseñas a mano por cada negocio nuevo. Internet Identity le da a cada persona (dueño de clínica, trabajadora) una identidad ligada a su dispositivo, sin que el operador de la plataforma tenga que administrar credenciales de nadie.
- **Modelo de costos por cycles.** En vez de una factura de hosting que crece con cada cliente nuevo (como pasaría en Vercel/AWS), el consumo se paga por cómputo real usado.
- **Aislamiento de datos entre clínicas más natural.** Un canister por tenant (o un esquema multi-tenant dentro de un canister) separa los datos de cada clínica sin construir esa lógica de aislamiento a mano en una base de datos compartida.
- **Ángulo de marketing real, no solo técnico.** "Agenda verificable, no manipulable" o "el primer sistema operativo Web3 para clínicas en Chile" es un diferenciador de producto más creíble en un SaaS que se vende a otros negocios, que en la web de un solo spa.

## Lo que ICP NO resuelve (honestidad, no venta de humo)

- El valor es para el **operador de la plataforma** (quien construya y mantenga esto) y para las **clínicas-cliente** (más simple de administrar). No es un value prop directo para los pacientes/clientas finales — a ellas no les importa si el backend es ICP o cualquier otra cosa, igual que a las clientas de Liza no les importa hoy.
- No resuelve adopción de pagos cripto por parte de clientes finales — ese problema (identificado en las conversaciones sobre vUSD) sigue igual de vigente.
- No es gratis de construir ni mantener — sigue siendo un producto real que alguien tiene que operar.

## Qué se reutiliza de Liza

El código de Liza es directamente la base/prototipo:
- Patrón de dashboard con roles (admin/worker) — `src/frontend/api/_lib/session.ts`, `Dashboard.tsx`
- Generador de links de pago — `useFlowPayment.ts`
- Estructura de datos de servicios/agenda/combos — `mocks/backend.ts` (hoy hardcodeado para Liza, tendría que volverse configurable por tenant)

Liza sería, en este escenario, el primer "tenant" — el caso de uso piloto real sobre el que ya se está construyendo y probando.

## Qué falta para que sea real (lista larga, sin comprometerse a nada)

- [ ] Definir modelo de multi-tenancy: ¿un canister por clínica, o un esquema multi-tenant dentro de uno solo?
- [ ] Internet Identity integrado, reemplazando el esquema de contraseñas nombradas
- [ ] Branding configurable por tenant (hoy todo el diseño está hardcodeado para Liza — ver `DESIGN.md`)
- [ ] Cada clínica con su propia integración de pagos (Flow u otro proveedor por tenant)
- [ ] Modelo de negocio: ¿suscripción mensual, comisión por transacción, freemium?
- [ ] Deploy de un canister real — hoy no existe ninguno desplegado, ni para Liza ni para esto
- [ ] Decidir si esto se separa a su propio repositorio el día que pase de idea a proyecto

## Próximo paso si esto avanza

Nada por ahora. Si en algún momento se decide perseguir esto en serio, el primer paso sería separar este concepto de este repositorio (que es específicamente el negocio de Liza) hacia uno propio, y recién ahí empezar a diseñar la arquitectura multi-tenant desde cero.
