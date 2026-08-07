# Riesgos y Planes B — Liza Espacio Belleza

Registro de escenarios de riesgo una vez todas las APIs (Flow, Shopify, Instagram, Gmail, WhatsApp) estén activas y en uso real. Para cada uno: qué pasa, qué tan grave es, cómo evitarlo, y qué hacer si ya pasó.

> Actualizar este archivo cuando se resuelva un riesgo (marcar ✅) o aparezca uno nuevo. No es documentación técnica — es la lista de "qué puede salir mal" para revisar cada cierto tiempo.

---

## 1. Password única del dashboard filtrada

**Estado:** 🔴 Sin mitigar

**Qué pasa:** El login del dashboard es una sola contraseña compartida. Si se filtra (captura de pantalla, compu compartido, WhatsApp), quien la tenga ve ingresos reales, agenda completa del día (incluye riesgo físico: saber cuándo el local está solo o lleno), datos de clientas, y puede generar links de cobro Flow reales.

**Por qué es grave:** No hay log de quién entró, ni forma de cerrar sesiones activas remotamente. Una sola contraseña = una sola fuga expone todo.

**Cómo evitarlo:**
- Nunca enviar la contraseña por WhatsApp o email sin cifrar
- No guardarla en el navegador de un computador compartido
- Rotarla cada 2–3 meses (cambiar `DASHBOARD_PASSWORD` en Vercel)

**Plan B (si ya se filtró):**
1. Cambiar `DASHBOARD_PASSWORD` en Vercel inmediatamente → invalida el acceso de quien la tenía
2. Cambiar también `DASHBOARD_SESSION_SECRET` → cierra todas las sesiones activas, incluida la tuya (vuelves a entrar con la nueva password)
3. Revisar logs de Vercel (`vercel logs`) para ver qué IPs/horarios accedieron

---

## 2. Gmail equivocado conectado

**Estado:** 🔴 Sin mitigar (Gmail aún no conectado al dashboard)

**Qué pasa:** El Gmail MCP disponible hoy apunta a `Lagregochilena@gmail.com`, que NO es el correo de Liza. Si se conecta por error o se mezcla con el correo real del negocio, se arriesga mostrar correspondencia personal en una herramienta de negocio — o enviar algo desde la cuenta equivocada.

**Por qué es grave:** Mezcla de vida personal y negocio, posible filtración de información privada no relacionada con Liza.

**Cómo evitarlo:**
- Confirmar explícitamente cuál es el Gmail del negocio antes de autorizar cualquier acceso
- Nunca autorizar `Lagregochilena@gmail.com` para uso del dashboard

**Plan B (si se conectó el equivocado):**
1. Revocar el acceso OAuth desde la configuración de Google de esa cuenta inmediatamente
2. Verificar en el dashboard/logs si se leyó o envió algo desde esa cuenta
3. Reconectar con el Gmail correcto del negocio

---

## 3. Precio desincronizado entre Shopify, el mock y Flow

**Estado:** 🟡 Riesgo latente — decisión tomada, falta implementar

**Qué pasa:** Los servicios/combos del sitio React hoy son datos fijos en código (`mockBackend`), separados del catálogo real de Shopify. Si se actualiza un precio en Shopify pero no en el código (o viceversa), una clienta puede ver un precio en la web y que Flow le cobre otro.

**Por qué es grave:** Riesgo de reclamo de clienta, pérdida de confianza, posible problema con SERNAC si hay diferencia entre precio publicitado y cobrado.

**Decisión (2026-08):** Shopify queda como fuente de verdad única del catálogo. Cuando el canister ICP esté desplegado, se sincroniza leyendo el catálogo de Shopify por API (misma Admin API que ya usa `api/shopify-orders.ts`) — no se mantienen precios escritos a mano en dos lugares. Hasta que el canister exista, el mock sigue siendo la referencia temporal y hay que actualizarlo a mano.

**Cómo evitarlo (mientras no esté el sync automático):**
- Cada vez que cambie un precio en Shopify, actualizar también `src/frontend/src/mocks/backend.ts`

**Plan B (si ya hubo un cobro con precio distinto al mostrado):**
1. Reembolsar o ajustar manualmente vía Flow el monto diferencial
2. Corregir el precio en el código y hacer deploy inmediato
3. Auditar cuántas otras clientas pudieron verse afectadas en la misma ventana de tiempo

---

## 4. WhatsApp Business bloqueado por Meta

**Estado:** ⚪ No aplica aún (WhatsApp API no conectada — se usa link `wa.me/` manual)

**Qué pasa:** Si se activa la API oficial de WhatsApp Business y hay mal uso de plantillas de mensaje o reportes de spam de clientas, Meta puede suspender el número sin aviso previo.

**Por qué es grave:** WhatsApp es el canal principal de contacto con clientas. Perderlo de un día para otro sin plan B deja a Liza sin forma de comunicarse.

**Qué cuenta como mal uso (lo que sí dispara una suspensión):**
- Escribirle a números que nunca dieron su teléfono al negocio (listas compradas/raspadas de Instagram, por ejemplo) — es la causa #1 de baneo
- Tasa alta de bloqueos o reportes de "spam" por parte de clientas → baja el "quality rating" (semáforo verde/amarillo/rojo de Meta); en rojo, limitan o suspenden el número
- Mandar texto libre (no plantilla) a alguien que no te escribe hace más de 24 horas — solo se permite con plantilla pre-aprobada
- Envíos masivos en ráfaga a muchos números en pocos minutos

**Lo que sí es seguro:** recordatorios a quien reservó y dio su número en ese momento, responder a quien te escribió primero, confirmaciones post-servicio a clientas reales. La regla práctica: **si la clienta te dio su número directamente, estás segura. Si armas una lista y le escribes a quien nunca te contactó, ahí se rompe.**

**Cómo evitarlo:**
- No enviar mensajes masivos no solicitados por el número de WhatsApp Business
- Usar solo plantillas aprobadas por Meta para mensajes iniciados por el negocio
- Mantener buena tasa de respuesta y baja tasa de bloqueo de clientas

**Plan B (si el número se bloquea):**
1. Volver al flujo manual: botón `wa.me/` desde el celular personal/de trabajo (ya existe en el sitio, no depende de la API)
2. Contactar soporte de Meta Business para apelar la suspensión
3. Avisar a clientas frecuentes por otro canal (Instagram DM, email) mientras se resuelve

---

## 5. Cuenta de Vercel suspendida (plan Hobby)

**Estado:** 🟡 Riesgo latente — plan gratuito en uso comercial real

**Qué pasa:** El plan Hobby de Vercel es "gratis para uso no comercial" según sus términos. Con tráfico real de un negocio en producción, existe un riesgo (bajo pero real) de que Vercel suspenda el proyecto sin aviso.

**Por qué es grave:** El dashboard y el sitio público viven en el mismo proyecto de Vercel — si se suspende, se caen los dos a la vez.

**Cómo evitarlo:**
- Cuando el negocio crezca (más tráfico, más dependencia del sitio), pasar a plan Pro ($20 USD/mes) antes de que se vuelva un problema
- Monitorear el uso desde el dashboard de Vercel de vez en cuando

**Plan B (si se suspende):**
1. Contactar soporte de Vercel para reactivar (usualmente basta con pasar a plan Pro)
2. Mientras tanto, el sitio principal en Shopify (`lizaespaciobelleza.cl`) sigue funcionando — no depende de Vercel
3. Tener un respaldo del código en GitHub permite redesplegar en otra plataforma (Netlify, Cloudflare Pages) si fuera necesario

---

## 6. Token de Shopify con permisos de más

**Estado:** ⚪ No aplica aún (token no generado)

**Qué pasa:** Al generar el Admin API token en Shopify, si se le dan permisos de escritura (no solo lectura) y hay un bug en el código del dashboard, podría modificarse o cancelarse un pedido real por accidente.

**Por qué es grave:** Afecta pedidos y datos reales de clientas en el sistema de ventas principal.

**Cómo evitarlo:**
- Al generar el token en Shopify Admin, dar **solo permisos de lectura** (`read_orders`, `read_products`) — nunca de escritura, salvo que se necesite explícitamente
- Revisar el scope del token antes de guardarlo en Vercel

**Plan B (si se detecta un cambio no autorizado):**
1. Revocar el token inmediatamente desde Shopify Admin → Apps → Develop apps
2. Revisar el historial de pedidos en Shopify para identificar qué se modificó
3. Generar un nuevo token con permisos de solo lectura

---

## 7. Un solo admin con acceso a todo (Philippe)

**Estado:** 🟡 Riesgo latente — sin plan de continuidad

**Qué pasa:** Todas las claves (Vercel, Flow, Shopify, futuras APIs) viven en la cuenta personal de Philippe. Si pierde acceso (notebook robado, cuenta bloqueada, olvido de contraseña de Vercel), no hay un segundo admin ni documentación de recuperación.

**Por qué es grave:** El negocio queda operativamente dependiente de una sola persona incluso para tareas técnicas básicas como cambiar un precio o revisar un pago.

**Decisión (2026-08):** Philippe mantiene copias de respaldo de las claves críticas (fuera de esta conversación, en un lugar seguro de su elección — gestor de contraseñas o similar) en lugar de agregar un segundo admin por ahora.

**Cómo evitarlo:**
- Activar verificación en dos pasos en la cuenta de Vercel y GitHub
- Guardar copia de las claves críticas (Flow, Shopify, session secret) en un gestor de contraseñas propio — no solo en Vercel

**Plan B (si se pierde el acceso):**
1. Recuperar cuenta de Vercel/GitHub vía el flujo estándar de "forgot password" + 2FA de respaldo
2. Si el email de recuperación también se perdió, contactar soporte de Vercel/GitHub con prueba de identidad
3. El código fuente está en GitHub — mientras el repo no se pierda, el proyecto se puede redesplegar desde cero en una cuenta nueva

---

## Resumen — prioridad de acción

| # | Riesgo | Prioridad | Por qué primero |
|---|--------|-----------|------------------|
| 1 | Password del dashboard filtrada | 🔴 Alta | Expone todo el negocio de una vez |
| 3 | Precios desincronizados | 🔴 Alta | Afecta directamente a clientas y cobros |
| 2 | Gmail equivocado | 🟡 Media | Aún no conectado, pero crítico cuando se active |
| 6 | Token Shopify con permisos de más | 🟡 Media | Se evita en el momento de generar el token |
| 7 | Un solo admin | 🟡 Media | No urgente, pero crece con el negocio |
| 5 | Vercel Hobby suspendido | 🟢 Baja | Bajo riesgo actual, sube con más tráfico |
| 4 | WhatsApp bloqueado | ⚪ N/A | Solo aplica si se activa la API oficial |
