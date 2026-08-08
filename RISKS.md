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

## 2. Gmail personal mezclado con correspondencia de negocio

**Estado:** 🟡 Riesgo aceptado para pruebas — decisión explícita de Philippe (2026-08-07)

**Qué pasa:** El Gmail MCP disponible apunta a `Lagregochilena@gmail.com`. Philippe confirmó que esta cuenta ya recibe las notificaciones reales de reservas vía bigbox, así que se autorizó usarla como cuenta de prueba para el dashboard en vez de esperar un correo dedicado al negocio. El riesgo real ahora no es "cuenta equivocada" sino mostrar correspondencia personal no relacionada al negocio al leer esa bandeja.

**Por qué es grave:** Si el dashboard (o quien lo lea) muestra correos personales de Philippe sin querer, se mezcla vida personal con una herramienta que podría verse por su socio o trabajadoras.

**Cómo evitarlo:**
- Al construir la integración, filtrar solo correos relacionados a reservas/bigbox — no mostrar la bandeja completa
- No enviar correos desde esta cuenta sin pedido explícito de Philippe en la sesión actual
- Evaluar más adelante si conviene migrar a un correo dedicado 100% al negocio (menos riesgo, más profesional de cara a clientas)

**Plan B (si se muestra algo personal por error):**
1. Quitar de inmediato esa vista/función del dashboard
2. Revisar qué se mostró y a quién (si el dashboard fue visto por alguien más en ese momento)
3. Ajustar el filtro antes de reactivar la integración

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

## 8. Dependencia de APIs externas (cambios sin aviso)

**Estado:** 🟡 Riesgo estructural — no hay ICP nativo para pagos, todo pasa por APIs de terceros

**Qué pasa:** Ningún pago pasa por ICP hoy (no hay canister, vUSD es demo). El 100% de los pagos reales depende de la API de Flow, y a futuro el dashboard dependerá también de la API de Shopify Admin y de Instagram Graph API. Estos proveedores pueden, sin avisar directamente a Liza:
- Cambiar de versión su API (Meta ya deprecó Instagram Basic Display API y obligó a migrar a Graph API)
- Rotar requisitos de autenticación (tokens que expiran, nuevos scopes obligatorios)
- Modificar formatos de respuesta que rompan el código que los procesa

**Por qué es grave:** Si Flow cambia algo en su API sin que nos enteremos, los cobros dejan de funcionar de un día para otro — no hay alerta automática, se detecta cuando una clienta reporta que no puede pagar.

**Cómo evitarlo:**
- No hay forma de prevenirlo del todo — es una dependencia estructural de depender de servicios de terceros
- Mitigación real: monitoreo activo (ver plan más abajo) en vez de esperar a que una clienta avise

**Plan B (si una API deja de funcionar):**
1. Revisar `vercel logs` para identificar el endpoint que falla y el error exacto
2. Revisar la documentación/changelog del proveedor (Flow, Meta, Shopify) para ver si hubo un cambio anunciado
3. Actualizar el código del endpoint afectado y redeploy

**Plan a futuro (propuesto 2026-08, no implementado):** app de monitoreo que revisa periódicamente la salud de cada API externa (Flow, Shopify, Instagram) y alerta a Philippe automáticamente si algo se rompe, en vez de depender de que una clienta reporte el problema primero. Ver sección "Plan de monitoreo" al final de este documento.

---

## Resumen — prioridad de acción

| # | Riesgo | Prioridad | Por qué primero |
|---|--------|-----------|------------------|
| 1 | Password del dashboard filtrada | 🔴 Alta | Expone todo el negocio de una vez |
| 3 | Precios desincronizados | 🔴 Alta | Afecta directamente a clientas y cobros |
| 8 | Dependencia de APIs externas | 🔴 Alta | Un cambio silencioso puede cortar los cobros sin aviso |
| 2 | Gmail personal mezclado con negocio | 🟡 Media | Autorizado para test — filtrar bien qué se muestra |
| 6 | Token Shopify con permisos de más | 🟡 Media | Se evita en el momento de generar el token |
| 7 | Un solo admin | 🟡 Media | No urgente, pero crece con el negocio |
| 5 | Vercel Hobby suspendido | 🟢 Baja | Bajo riesgo actual, sube con más tráfico |
| 4 | WhatsApp bloqueado | ⚪ N/A | Solo aplica si se activa la API oficial |

---

## Plan de monitoreo (propuesto — no implementado)

Idea de Philippe: una app que vigile la salud de las APIs externas y alerte automáticamente en vez de esperar a que algo se rompa en producción sin avisar.

**Diseño en 3 niveles, de más simple a más ambicioso:**

### Nivel 1 — Monitoreo con alerta (barato, alto valor, se puede construir ahora)
Una función programada (cron job en Vercel) que cada cierto tiempo llama a cada API externa (Flow, Shopify, Instagram) con una petición mínima de prueba y revisa que la respuesta sea la esperada. Si algo falla, manda una alerta a Philippe por WhatsApp o email — no hay IA involucrada, es un chequeo de salud simple, igual que un servicio de "uptime monitoring".

### Nivel 2 — Reporte estructurado (medio)
Cuando el chequeo falla, en vez de solo alertar, arma automáticamente un reporte (qué falló, mensaje de error, hora) y crea un issue en GitHub — queda registrado y listo para revisar en la próxima sesión, en vez de perderse en una notificación de WhatsApp.

### Nivel 3 — Parche asistido por Claude (la ambición completa)
Un proceso programado revisa esos issues abiertos, investiga el error, y prepara una propuesta de arreglo (un pull request) — pero **nunca se auto-despliega a producción sin que Philippe lo apruebe explícitamente**, sobre todo si toca código de pagos (Flow). Auto-parchar y desplegar solo sin revisión humana es demasiado riesgoso para código que mueve dinero real — un parche mal generado podría cobrar de más, duplicar cobros, o romper el checkout completo.

**Recomendación:** empezar por el Nivel 1 — es rápido de construir, no tiene riesgo, y ya resuelve el problema real ("nos enteramos por la clienta, no antes"). Los niveles 2 y 3 se evalúan después de tener el Nivel 1 funcionando.
