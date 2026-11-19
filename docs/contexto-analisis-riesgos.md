# Contexto para análisis de riesgos · Seguimiento de Trámites Académicos UNICA

Documento de contexto operativo para un agente encargado de **identificar, valorar y mitigar riesgos** del prototipo de seguimiento de trámites académicos de la Universidad Nacional “San Luis Gonzaga” de Ica (UNICA).

| Campo | Valor |
| --- | --- |
| Versión | 1.0 |
| Fecha | 18 de noviembre de 2026 |
| Repositorio | `/home/aadu/dev/seguimiento` |
| Insumos | `especificaciones.md`, `especificaciones_v2.md`, `docs/sprint-review.md` y código en `src/` |
| Audiencia | Agente de análisis de riesgos, seguridad, calidad y producto |
| Naturaleza | Prototipo de alta fidelidad, sin backend real ni autenticación de producción |

---

## 1. Cómo usar este documento

Este documento **no es un registro de riesgos**. Es el contexto que el agente de riesgos necesita para producirlo sin repetir la exploración del producto.

### 1.1 Objetivo del trabajo derivado

Producir un análisis que responda, como mínimo:

1. **Qué puede fallar** en el prototipo y en su eventual evolución a producción.
2. **Qué probabilidad e impacto** tiene cada riesgo.
3. **Qué controles existen hoy** y cuáles son solo declarativos.
4. **Qué mitigaciones** son proporcionales al estado actual (prototipo vs. producción).
5. **Quién debería ser responsable** y **qué evidencia** demuestra que la mitigación funcionó.

### 1.2 Jerarquía de fuentes

Cuando exista contradicción, aplicar este orden:

1. **Código y pruebas ejecutables** (`src/`, `npm test`): describen lo que realmente hace el prototipo.
2. **`docs/sprint-review.md`**: evidencia de la demostración y del estado reportado.
3. **`especificaciones_v2.md`**: requisito normativo vigente (UNICA, seguridad, paleta).
4. **`especificaciones.md`**: versión inicial; sólo aplica si v2 no la reemplaza.

> Regla práctica: v2 reemplaza a v1 en identidad institucional, autenticación, aislamiento de datos y modelo de estados. v1 sigue aportando la intención UX (stepper, badges, carga de documentos, mensajes).

### 1.3 Límites del análisis

- No asumir que el prototipo es production-ready. La brecha prototipo → producción es, en sí misma, una fuente de riesgo.
- Distinguir siempre entre **riesgo del prototipo actual** (demo, UX, evidencia) y **riesgo de la futura implementación** (datos reales, backend, SSO).
- No inventar controles no presentes en el código. Si un control sólo aparece en la especificación, marcarlo como **no implementado**.
- Citar archivo y línea o prueba concreta cuando se afirme un hallazgo.

---

## 2. Resumen del producto

### 2.1 Problema

Los estudiantes de la UNICA solicitan constancias, certificados de notas y trámites similares. Tras registrar la solicitud desconocen:

- el avance real del trámite,
- el área responsable,
- si deben entregar documentación adicional,
- cuándo hubo el último movimiento.

Esto genera consultas por correo, teléfono y visitas presenciales, y consume tiempo operativo administrativo.

### 2.2 Propuesta

Un módulo dentro del **Campus Virtual UNICA** donde el estudiante autenticado:

- ve únicamente sus propios trámites,
- consulta estado, área responsable y siguiente paso,
- identifica requisitos observados,
- adjunta documentos para subsanar,
- verifica la fecha de última actualización.

### 2.3 Propuesta de valor y métricas esperadas

| Objetivo | Indicador deseado |
| --- | --- |
| Autoservicio | Menos consultas por correo/teléfono/ventanilla |
| Transparencia | Estado, responsable y siguiente paso visibles sin interpretar jerga |
| Subsanación remota | Documentos observados cargados sin visita presencial |
| Confianza | Fecha de última actualización clara y consistente con el estado |

---

## 3. Alcance y naturaleza del entregable

### 3.1 Dentro del alcance

- Prototipo web interactivo de alta fidelidad.
- HU-01 a HU-04 y sus criterios de aceptación.
- Sesión simulada del Campus Virtual y aislamiento funcional por `estudianteId`.
- Datos ficticios con casos exitosos, 403, 404 y 500.
- Identidad visual naranja/blanco UNICA.
- Pruebas automatizadas de API simulada, store, formato y UI.
- Guion de Sprint Review y matriz de evidencias.

### 3.2 Fuera del alcance actual

- Backend real, base de datos, API HTTP y red.
- SSO institucional real, JWT verificado, cookies de sesión y RBAC de servidor.
- Almacenamiento real de archivos, antivirus, cuarentena y firma digital.
- Notificaciones por correo o WhatsApp.
- Analítica, auditoría persistente y panel administrativo.
- Accesibilidad certificada, pruebas con usuarios reales y E2E en navegador.
- Despliegue productivo con datos personales reales.

### 3.3 Estado de madurez

El repositorio contiene una implementación funcional del prototipo, con `67` pruebas en `6` archivos, todas en verde al 18/11/2026. La demo se ejecuta localmente o en un despliegue de Next.js. La base ficticia vive en memoria y se restaura al recargar.

---

## 4. Fuentes, roles y divergencias documentales

| Fuente | Rol | Observaciones |
| --- | --- | --- |
| `especificaciones.md` | Especificación inicial | Habla de React/Next, MSW o JSON, estados `EN_PROCESO`, búsqueda por código o DNI, alcance general sin institución. |
| `especificaciones_v2.md` | Especificación vigente | Incorpora UNICA, paleta naranja/blanco, sesión Campus Virtual, aislamiento por `estudianteId`, 403, estados `EN_EVALUACION`/`FIRMA_DIGITAL`, mock data UNICA. |
| `docs/sprint-review.md` | Evidencia de implementación | Guion de 10 escenarios, matriz de evidencias, 67 pruebas, DoD cumplido, notas de simulación. |
| `src/` | Verdad ejecutable | Implementación real; en varios puntos simplifica lo que la especificación describe. |
| `README.md` | Guía de demo | Resume rutas, casos, mensajes exactos y estado del prototipo. |

### 4.1 Divergencias relevantes que el análisis debe considerar

| Tema | Especificación | Implementación actual | Implicación |
| --- | --- | --- | --- |
| Capa de mocking | MSW con latencia y respuestas HTTP | Funciones en proceso (`src/lib/mock-api.ts`), sin red ni HTTP | Los “códigos 200/403/404/500” son campos de objeto, no respuestas reales |
| Autenticación | SSO Campus Virtual + JWT | Sesión hardcodeada en Zustand (`CURRENT_STUDENT_SESSION`) con token ficticio no usado | El aislamiento es de interfaz, no de servidor |
| Tailwind | `tailwind.config.js` con colores `unica.*` | Tailwind v4 con `@theme` en `src/app/globals.css` | Equivalente visual, distinto mecanismo de configuración |
| Estados | v1: `EN_PROCESO`; v2: `EN_EVALUACION`, `FIRMA_DIGITAL` | Modelo v2, con alias de simulación para `EN_PROCESO` | Los alias amplían la superficie de entrada |
| Búsqueda | v1 permite código o DNI | Sólo código o tipo de trámite; no hay DNI | Se eliminó un identificador personal del flujo, pero también una vía de consulta prevista |
| Mensaje 404 | “No se encontró…” | Implementado literalmente | Correcto respecto de v2 |
| Existencia de códigos ajenos | 403 explícito para código de otro estudiante | Implementado | Un código exacto ajeno confirma su existencia (ver §9) |
| `STATUS` | No previsto en v2 | Extensión de demo en `src/lib/estados.ts` | Permite forzar cualquier estado en la vista |
| Persistencia | No definida | Sólo memoria; recarga restaura datos | La subsanación se pierde al recargar |
| Error 401 | No previsto | La API lo devuelve; el store lo trata como fallo de servicio | Una sesión inválida no redirige a login |
| Pruebas | v2 pide pruebas de aislamiento | Hay pruebas unitarias/UI; no hay E2E ni HTTP real | Cobertura funcional, no de integración real |

---

## 5. Actores, flujos e historias de usuario

### 5.1 Actores

| Actor | Descripción | Necesidad |
| --- | --- | --- |
| Estudiante autenticado | Ana Lucia Mendoza, código `20221045`, Ingeniería de Sistemas | Ver sólo sus trámites y resolver observaciones |
| Estudiante ajeno | Código `20219999`, titular de `002` y `099` | No debe ser visible ni consultable |
| Personal administrativo | Áreas responsables: Registro Académico, Mesa de Partes, Decanato | Recibir subsanaciones y actualizar estados (fuera del prototipo) |
| Evaluador / docente | Revisor de Sprint Review | Verificar HU, seguridad, diseño y DoD |

### 5.2 Flujo principal

```text
Ingreso al Campus Virtual (sesión simulada)
  → listado automático de trámites propios
  → búsqueda por código o tipo (opcional)
  → selección de un trámite
  → detalle: estado, fechas, stepper, área responsable, siguiente paso
  → si PENDIENTE_DOCUMENTOS: banner + carga de archivos + envío
  → confirmación “Subsanación enviada” y retorno a EN_EVALUACION
```

### 5.3 Flujos alternativos

| Situación | Resultado esperado |
| --- | --- |
| Código de otro estudiante | Bloqueo 403, mensaje exacto, sin datos del titular |
| Código inexistente | Aviso 404, sin revelar datos |
| Falla simulada | Pantalla de contingencia 500 y botón Reintentar |
| Sesión cerrada | Pantalla “Sesión finalizada”; no se puede consultar |
| Archivo inválido | Rechazo por formato, tamaño, vacío o duplicado |
| Envío sin archivos o con carga en curso | Bloqueo con mensaje de validación |
| Parámetro `STATUS` inválido | Aviso de modo demo; se muestra el estado real |
| Parámetro `STATUS` válido | Vista forzada al estado indicado, con aviso y enlace “Ver estado real” |

### 5.4 Historias y criterios de aceptación

| HU | Sprint | Criterio | Resultado verificable |
| --- | --- | --- | --- |
| HU-01 | 1 | 1.1 Listado propio | Se listan 4 trámites de `20221045`, sin `002` ni `099` |
| HU-01 | 1 | 1.2 Solicitud ajena | 403 y mensaje “Acceso restringido: Esta solicitud no pertenece a tu cuenta institucional” |
| HU-01 | 1 | 1.3 Código inexistente | 404 y mensaje “No se encontró ninguna solicitud asociada a tu cuenta con ese código” |
| HU-01 | 1 | 1.4 Falla del servicio | 500, “Servicio no disponible momentáneamente.” y botón Reintentar |
| HU-02 | 1 | 2.1 Área y siguiente paso | Stepper con fase actual, área responsable y acción siguiente |
| HU-03 | 2 | 3.1 Documentos observados | Banner ámbar, requisitos, Drag & Drop, validación y confirmación |
| HU-04 | 2 | 4.1 Última actualización | “Última actualización: 12/11/2026, 11:20 AM” visible |

---

## 6. Arquitectura implementada

### 6.1 Stack real

| Capa | Tecnología | Notas |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) + React 19 | Todo el módulo es cliente; páginas server sólo resuelven params/metadata |
| Lenguaje | TypeScript 5.9 | Tipos en `src/lib/types.ts` |
| Estilos | Tailwind CSS 4 + utilidades propias | Tokens UNICA en `globals.css`; no hay `tailwind.config.js` |
| UI | Componentes propios estilo Shadcn + Radix Slot | `src/components/ui/*` |
| Estado | Zustand 5 | `src/store/useSeguimientoStore.ts` |
| Mocking | Funciones TypeScript en memoria | `src/lib/mock-api.ts`; no MSW |
| Iconos | Lucide React | Consistente en toda la UI |
| Pruebas | Vitest 4 + Testing Library | 6 archivos, 67 pruebas |
| Despliegue | Next.js / Vercel | `vercel.json`; cabeceras en `next.config.ts` |

### 6.2 Rutas

| Ruta | Propósito |
| --- | --- |
| `/` | Módulo (misma experiencia) |
| `/mis-tramites` | Listado y búsqueda |
| `/mis-tramites/[codigo]` | Detalle por trámite |
| `/campusvirtual/mis-tramites` | Ruta institucional equivalente |
| `/campusvirtual/mis-tramites/[codigo]` | Detalle institucional |

El query param `STATUS` sólo se interpreta en rutas de detalle. Valores válidos: `EN_EVALUACION`, `PENDIENTE_DOCUMENTOS`, `FIRMA_DIGITAL`, `FINALIZADO`, más alias (`EN_PROCESO`, `FIRMA`, `LISTO_PARA_ENTREGA`, etc.).

### 6.3 Componentes principales

| Componente | Responsabilidad |
| --- | --- |
| `layout/campus-portal.tsx` | Decide login vs. módulo según `sesion` |
| `layout/header.tsx`, `footer.tsx` | Marco institucional y cierre de sesión |
| `layout/login-screen.tsx` | Reingreso simulado |
| `seguimiento-app.tsx` | Orquesta vistas, búsqueda, listado, detalle y simulación |
| `search-form.tsx` | Validación de entrada y disparo de consulta |
| `demo-panel.tsx` | Casos de prueba, error 500 y “ver todos” |
| `solicitud-card.tsx` | Resumen de trámite en el listado |
| `resultado-solicitud.tsx` | Detalle: tarjeta, stepper, entrega y documentos |
| `status-card.tsx` | Estado, fechas, estudiante y descripción |
| `timeline-stepper.tsx` | Progreso, área responsable y siguiente paso |
| `documents-panel.tsx` | Observación, requisitos y confirmación |
| `document-upload-zone.tsx` | Drag & Drop, validación, progreso y envío |
| `entrega-panel.tsx` | Trámite finalizado y descarga demo |
| `states/*` | Carga, vacío, 404, 403 y 500 |

### 6.4 Flujo de estado

```text
Zustand store
  ├─ sesion: EstudianteSesion | null
  ├─ vista: idle | cargando | exito | no_encontrada | prohibido | error_servicio
  ├─ solicitudes / seleccionada
  ├─ textoConsulta / consulta
  ├─ simularFallo
  ├─ archivos / enviando / subsanacionEnviada
  └─ errores de validación y de envío

mock-api
  ├─ consultarSolicitudesEstudiante(texto, sesion, opciones)
  ├─ enviarSubsanacionApi(codigo, sesion, documentos, opciones)
  └─ resetMockData()
```

Protecciones internas observadas:

- Contador `consultaActual` para descartar respuestas obsoletas.
- Clonado de objetos al devolver datos.
- Filtro por `estudianteId` antes de buscar.
- Validación de titularidad antes de mutar una solicitud en la subsanación.

---

## 7. Modelo de datos y conjunto ficticio

### 7.1 Tipos

```typescript
interface EstudianteSesion {
  estudianteId: string;
  nombreCompleto: string;
  codigoUniversitario: string;
  facultad: string;
  tokenSimulado: string;
}

type EstadoSolicitud =
  | "EN_EVALUACION"
  | "PENDIENTE_DOCUMENTOS"
  | "FIRMA_DIGITAL"
  | "FINALIZADO";

interface SolicitudUNICA {
  codigoSolicitud: string;
  estudianteId: string;        // clave de aislamiento
  tipoTramite: string;
  estado: EstadoSolicitud;
  fechaRegistro: string;       // "YYYY-MM-DD HH:mm"
  fechaUltimaActualizacion: string;
  areaResponsable: string;
  siguientePaso: string;
  documentosPendientes?: string[];
  documentosRecibidos?: string[]; // extensión del prototipo
}
```

### 7.2 Base ficticia

| Código | Titular | Trámite | Estado | Uso en demo |
| --- | --- | --- | --- | --- |
| `SOL-UNICA-2026-001` | `20221045` (propia) | Constancia de Estudios 2026-II | `EN_EVALUACION` | Caso exitoso y HU-02/HU-04 |
| `SOL-UNICA-2026-002` | `20219999` (ajena) | Certificado de Notas | `EN_EVALUACION` | Prueba 403 |
| `SOL-UNICA-2026-003` | `20221045` (propia) | Certificado de Notas | `PENDIENTE_DOCUMENTOS` | HU-03 y subsanación |
| `SOL-UNICA-2026-004` | `20221045` (propia) | Certificado de Bachillerato | `FIRMA_DIGITAL` | Estado de firma |
| `SOL-UNICA-2026-005` | `20221045` (propia) | Constancia de Matrícula 2026-I | `FINALIZADO` | Entrega y descarga demo |
| `SOL-UNICA-2026-099` | `20219999` (ajena) | Constancia de Egresado | `FINALIZADO` | Prueba 403 adicional |

### 7.3 Persistencia

- `MOCK_SOLICITUDES_DATABASE` es inmutable en origen.
- `solicitudesRuntime` es una copia mutable a nivel de módulo.
- La subsanación actualiza esa copia en memoria: cambia estado a `EN_EVALUACION`, borra `documentosPendientes`, añade `documentosRecibidos` y actualiza la fecha.
- Al recargar la página se restaura la base original.
- No hay `localStorage`, `sessionStorage`, cookies ni backend.

---

## 8. Reglas de negocio implementadas

### 8.1 Consulta y aislamiento

1. Sin texto de búsqueda: devuelve todos los trámites del `estudianteId` en sesión, ordenados por `fechaUltimaActualizacion` descendente.
2. Con texto:
   - Normaliza mayúsculas, espacios y acentos.
   - Si el texto coincide **exactamente** con un código del sistema:
     - si es propio → devuelve ese trámite;
     - si es ajeno → **403** sin datos.
   - Si no hay coincidencia exacta, busca por subcadena en código o tipo **sólo dentro de los trámites propios**.
   - Sin coincidencias → **404**.
3. Sesión ausente o sin `estudianteId` → **401** en la API; el store lo agrupa como error de servicio.
4. `simularFallo` → **500** antes de cualquier otra lógica.

### 8.2 Subsanación

1. Requiere una solicitud seleccionada y sesión válida.
2. Requiere al menos un archivo.
3. Todos los archivos deben estar en estado `listo` (progreso simulado al 100%).
4. Validaciones por archivo:
   - tipo MIME en `application/pdf`, `image/jpeg`, `image/jpg`, `image/png`;
   - tamaño > 0 y ≤ 5 MB;
   - nombre no duplicado entre los ya agregados.
5. Si el código no existe → 404; si pertenece a otro → 403.
6. Éxito: estado `EN_EVALUACION`, fecha actual, nuevo `siguientePaso`, `documentosPendientes` vacío y lista de `documentosRecibidos`.
7. La UI muestra “Subsanación enviada”, badge “En revisión” y los documentos recibidos.

> Limitación funcional: no se exige que los archivos cubran **todos** los requisitos pendientes ni se asocia cada archivo a un requisito concreto.

### 8.3 Estados y progreso

| Estado | Fase actual del stepper | Avance calculado |
| --- | --- | --- |
| `EN_EVALUACION` | En Evaluación | 38% |
| `PENDIENTE_DOCUMENTOS` | En Evaluación (observado) | 25% |
| `FIRMA_DIGITAL` | Firma Digital | 63% |
| `FINALIZADO` | Listo para Entrega | 100% |

Fases: Registrado → En Evaluación → Firma Digital → Listo para Entrega.

### 8.4 Mensajes exactos

| Caso | Texto |
| --- | --- |
| 403 | “Acceso restringido: Esta solicitud no pertenece a tu cuenta institucional” |
| 404 | “No se encontró ninguna solicitud asociada a tu cuenta con ese código” |
| 500 | “Servicio no disponible momentáneamente.” + acción “Reintentar” |
| 401 (interno) | “La sesión del Campus Virtual no es válida.” |

### 8.5 Fechas

- Se interpretan como hora local (`parseFechaLocal`), evitando el desplazamiento UTC de `new Date("YYYY-MM-DD")`.
- Formatos: largo (“12 de noviembre de 2026, 10:30 AM”), compacto (“12/11/2026, 11:20 AM”) y corto (“10/11/2026”).
- La API ficticia serializa con `formatearFechaApi`, también en hora local.
- No hay zona horaria explícita ni conversión a `America/Lima`.

---

## 9. Seguridad y privacidad: diseñado vs. implementado

### 9.1 Controles previstos por la especificación v2

- Módulo protegido dentro de `/campusvirtual/mis-tramites`.
- Sesión de estudiante con `estudianteId`, nombre, código, facultad y token.
- Aislamiento fila a fila por `estudianteId`.
- 403 ante intento de acceso a solicitud ajena.
- Mensajes que no exponen datos del titular ajeno.

### 9.2 Realidad implementada

| Control | Estado | Evidencia |
| --- | --- | --- |
| Autenticación real | No implementado | `CURRENT_STUDENT_SESSION` hardcodeada; `tokenSimulado` no se valida |
| Autorización de servidor | No implementado | Filtro en `src/lib/mock-api.ts`, ejecutado en cliente |
| Aislamiento funcional | Implementado | Filtro por `estudianteId` y pruebas 403 |
| 403 sin datos | Implementado a nivel de retorno | `MensajeAccesoDenegado`, `SecurityState` |
| 404 sin datos | Implementado | `MENSAJE_NO_ENCONTRADO` |
| Bitácora de auditoría | Solo texto informativo en UI | `SecurityState` dice que “se registraría”; no se registra |
| Rate limiting / bloqueo | No implementado | No hay límite de intentos |
| Protección de archivos | Solo validación de cliente | MIME y tamaño declarados por el navegador |
| Antivirus / cuarentena | No implementado | No aplica en prototipo |
| Cifrado / almacenamiento | No implementado | No se sube nada; solo se guarda el nombre |
| CSP / HSTS | No configurado | `next.config.ts` sólo define `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` |
| Datos reales | No se usan | Todo es ficticio |

### 9.3 Hechos con implicación de seguridad

1. **El 403 confirma la existencia del código ajeno.** La especificación v2 lo exige; un atacante puede distinguir “código existente de otro” de “código inexistente”. El README afirma que un 404 “no revela si el código existe en otra cuenta”, lo cual es cierto sólo para búsquedas no exactas; la consulta exacta sí lo revela mediante 403.
2. **La base ficticia completa viaja al navegador.** `mock-data.ts` se importa desde componentes cliente y desde el store. Aunque la UI filtre, los registros de `20219999` están en el bundle. En un sistema real esto sería una fuga de datos.
3. **La sesión es un valor inicial, no una credencial.** Cualquier persona puede alterar el estado de Zustand desde las herramientas del navegador o modificar el código para actuar como otro `estudianteId`.
4. **El panel de pruebas y el simulador de fallo son visibles para el estudiante.** En producción permitirían sabotear la propia demo o simular estados inexistentes.
5. **`?STATUS=` permite forzar `FINALIZADO`.** La vista muestra el panel de entrega y permite descargar una constancia demo, aunque el trámite real no esté finalizado. El archivo se rotula como ficticio, pero una captura de pantalla podría inducir a error.
6. **El estado mutable es de alcance de módulo.** Si `mock-api.ts` llegara a ejecutarse en un servidor compartido, `solicitudesRuntime` sería compartido entre usuarios y peticiones. Hoy el import es cliente, pero es un riesgo de promoción.
7. **No hay timeout ni cancelación real.** La latencia es un `setTimeout`; no hay `AbortController`. El contador evita respuestas obsoletas, pero no aborta trabajo ni cubre fallos de red reales.
8. **El 401 no tiene flujo propio.** El store lo trata como `error_servicio`; el usuario vería “servicio no disponible” en lugar de ser enviado a login.
9. **La descarga de constancia se genera en cliente.** El contenido incluye nombre y código tomados de la sesión, no de la solicitud. Está marcada como demo y sin validez oficial.

### 9.4 Privacidad y cumplimiento

- Se muestran nombre completo, código universitario, facultad, tipo de trámite, área y fechas.
- Se referencian DNI y voucher de pago como requisitos, aunque no se cargan datos reales.
- No hay aviso de privacidad, consentimiento, política de retención ni base legal.
- En Perú, el tratamiento de datos personales se rige por la Ley N.° 29733 y su reglamento; el análisis debería considerar esa dimensión si el prototipo se presenta como precursor de producción.
- La función `enmascararDni` existe y está probada, pero **no se usa** en la interfaz.

---

## 10. UX/UI, diseño y accesibilidad

### 10.1 Identidad visual

| Token | Valor | Uso |
| --- | --- | --- |
| `unica-orange` | `#FF6600` | Marca, botones primarios, acentos |
| `unica-orange-dark` | `#E65100` | Hover y texto sobre fondos claros |
| `unica-orange-light` | `#FFF7ED` | Fondos suaves |
| `unica-orange-border` | `#FFEDD5` | Bordes |
| `unica-bg` | `#F8F9FA` | Fondo general |
| `unica-text` | `#1E293B` | Texto principal |
| `unica-muted` | `#64748B` | Texto secundario |

Estados:

- Verde/esmeralda: finalizado, entregado, éxito.
- Ámbar: pendiente de documentos, observación, acción requerida.
- Naranja: en evaluación, marca institucional.
- Rojo: acceso restringido, error de validación.

### 10.2 Patrones UX implementados

- Búsqueda con validación (`3–60` caracteres, letras/números/espacios/guiones).
- Resumen numérico de trámites (total, en curso, por subsanar, finalizados).
- Tarjetas de trámite con badge y última actualización.
- Detalle con stepper, área responsable, siguiente paso y panel lateral de ayuda.
- Estados de carga, vacío, 404, 403 y 500.
- Scroll automático al resultado o al error.
- Drag & Drop con progreso simulado y confirmación.
- Animaciones suaves y respeto a `prefers-reduced-motion`.
- Foco visible y etiquetas ARIA en varios controles.

### 10.3 Posibles tensiones de accesibilidad

- `#FF6600` sobre blanco tiene contraste aproximado de 3:1; puede no cumplir AA para texto normal pequeño. Se usa en textos de 10–11 px en algunos lugares.
- El stepper usa color e iconos; no depende sólo del color, pero la relación “observado” vs. “actual” se refuerza con badges.
- La zona Drag & Drop tiene botón y `input` accesible, pero la acción principal de arrastrar no es la única vía.
- No hay pruebas automáticas de accesibilidad (axe) ni navegación completa por teclado.
- El panel de pruebas añade ruido cognitivo y no está separado del flujo del estudiante.

---

## 11. Calidad, pruebas y Definición de Terminado

### 11.1 Suite actual

```text
Test Files  6 passed (6)
Tests       67 passed (67)
```

Archivos:

- `src/lib/mock-api.test.ts`
- `src/lib/estados.test.ts`
- `src/lib/format.test.ts`
- `src/lib/timeline.test.ts`
- `src/store/useSeguimientoStore.test.ts`
- `src/components/seguimiento-app.test.tsx`

### 11.2 Cobertura funcional reportada

| Área | Cubierta por |
| --- | --- |
| Listado propio, búsqueda, 403, 404, 500 | `mock-api.test.ts` |
| Aislamiento en store, sesión, subsanación, archivos | `useSeguimientoStore.test.ts` |
| Stepper y porcentajes | `timeline.test.ts` |
| Fechas y formatos | `format.test.ts` |
| Simulación `STATUS` | `estados.test.ts` |
| Integración UI, rutas, errores, carga | `seguimiento-app.test.tsx` |

### 11.3 Comandos de verificación

```bash
npm install
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Al 18/11/2026 se ejecutó `npm test` con 67/67 en verde. `lint`, `tsc` y `build` están reportados como cumplidos en `docs/sprint-review.md`; conviene re-ejecutarlos si el análisis se basa en el estado actual del árbol.

### 11.4 Brechas de verificación

- No hay pruebas E2E con navegador real.
- No hay pruebas de contrato HTTP ni MSW.
- No hay medición de cobertura (%).
- No hay pruebas de accesibilidad, responsive real ni dispositivos móviles.
- No hay pruebas de rendimiento, concurrencia, reconexión ni timeouts.
- No hay pruebas de seguridad ofensiva (enumeración, manipulación de store, fuga en bundle).
- No hay pruebas de persistencia porque no existe.
- No hay verificación de que los archivos cubran todos los requisitos.

### 11.5 DoD reportada

| Requisito | Evidencia | Estado reportado |
| --- | --- | --- |
| Diseño UNICA naranja/blanco | Header, tarjetas, botones, badges, tokens | Cumplido |
| Aislamiento por `estudianteId` | API, store y pruebas 403 | Cumplido |
| Respuesta a acceso no autorizado | Pantalla 403 con mensaje exacto | Cumplido |
| Código libre de errores críticos | build, lint, tsc | Reportado |
| Criterios Dado/Cuando/Entonces | 67 pruebas + guion manual | Cumplido |
| Casos exitoso, 404, 403 y 500 | Panel de pruebas + suite | Cumplido |
| Evidencia para Sprint Review | `docs/sprint-review.md` + demo | Cumplido |

---

## 12. Supuestos y restricciones para valorar probabilidad e impacto

1. **El prototipo no maneja datos reales.** Si se usa con datos reales, cambia por completo el perfil de riesgo.
2. **La demo se ejecuta en un entorno controlado.** El público objetivo son docentes y evaluadores, no estudiantes en producción.
3. **No hay backend.** Cualquier control de servidor está fuera del alcance actual, pero es obligatorio para producción.
4. **La sesión es única y conocida.** `20221045` es el único usuario activo; no hay multiestudiante real.
5. **La base es pequeña y fija.** Seis registros, sin concurrencia, sin migraciones, sin volumen.
6. **La persistencia es efímera.** Recargar restaura todo; esto es aceptable para demo, no para operación.
7. **El despliegue es estático/Next.** No hay base de datos ni servicios externos que fallen.
8. **Los archivos no se almacenan.** Solo se simula el progreso y se guarda el nombre.
9. **La fecha del sistema es noviembre de 2026.** Los datos ficticios están alineados con esa fecha; con el paso del tiempo, los textos relativos y la percepción de “movimiento reciente” pueden degradarse.
10. **El alcance es académico.** El objetivo es validar UX, flujo y aislamiento funcional, no certificar seguridad.

---

## 13. Superficies de riesgo sugeridas para el análisis

> Esta sección enumera **áreas y hechos objetivos**; no sustituye al registro de riesgos ni propone todavía la mitigación definitiva. El agente debe convertir cada superficie en riesgos concretos, evitando duplicados.

### 13.1 Seguridad y control de acceso

Hechos:

- El aislamiento se ejecuta en cliente.
- La base completa, incluida la de otro estudiante, está en el bundle.
- La sesión es hardcodeada y el token no se valida.
- El 403 exacto funciona como oráculo de existencia.
- No hay rate limiting ni auditoría persistente.
- El 401 no tiene flujo de reautenticación.
- El estado de Zustand es manipulable desde el navegador.

Preguntas guía:

- ¿Qué ocurre si el prototipo se conecta a una API real sin mover el filtro al servidor?
- ¿Cómo se evita que un estudiante cambie `estudianteId` en el cliente?
- ¿El 403 debe ser uniforme con el 404 para no revelar existencia, o el requisito de UX exige distinguirlos?
- ¿Cómo se protege la descarga de constancias?
- ¿Qué evidencia de auditoría se necesita y dónde se almacena?

### 13.2 Privacidad y cumplimiento

Hechos:

- Se muestran nombre, código, facultad y trámites.
- Se mencionan DNI y voucher.
- No hay aviso de privacidad ni retención.
- Hay una función de enmascaramiento de DNI sin uso.

Preguntas guía:

- ¿Qué datos personales son estrictamente necesarios en la vista?
- ¿Cómo se cumple minimización, consentimiento y seguridad bajo la normativa peruana?
- ¿Qué pasa con los archivos y metadatos si se implementa la carga real?
- ¿La descarga demo podría confundirse con un documento oficial?

### 13.3 Integridad de datos y reglas de negocio

Hechos:

- La subsanación no exige cubrir todos los requisitos.
- No hay asociación archivo ↔ requisito.
- La fecha de actualización se genera en cliente.
- Los estados se pueden forzar por URL.
- La simulación no persiste ni actualiza la base.
- La búsqueda exacta de un código ajeno cambia el flujo a 403.

Preguntas guía:

- ¿Cómo se garantiza que la subsanación esté completa y sea verificable?
- ¿Quién y cómo actualiza el estado real?
- ¿Qué pasa si dos pestañas o dos usuarios modifican la misma solicitud?
- ¿Cómo se evita que `STATUS` llegue a producción?
- ¿Qué consistencia debe haber entre estado, stepper, siguiente paso y fecha?

### 13.4 UX, accesibilidad y confianza

Hechos:

- El panel de pruebas está integrado en la vista del estudiante.
- El contraste naranja/blanco puede fallar AA en textos pequeños.
- Hay estados de error claros y mensajes exactos.
- El flujo de carga tiene validación y feedback.
- No hay pruebas con usuarios ni auditoría de accesibilidad.

Preguntas guía:

- ¿El estudiante entiende la diferencia entre “En Evaluación”, “Firma Digital” y “Finalizado”?
- ¿La fecha de última actualización transmite confianza o genera dudas por la zona horaria?
- ¿El panel de pruebas debe ocultarse en una demo pública?
- ¿La experiencia funciona en móvil y con lector de pantalla?

### 13.5 Operación, despliegue y continuidad de la demo

Hechos:

- No hay backend ni persistencia.
- La demo depende de que el proceso de Next esté vivo.
- El build se puede desplegar en Vercel.
- Las cabeceras de seguridad son básicas.
- La base se restaura al recargar.

Preguntas guía:

- ¿Qué ocurre si falla el despliegue durante la Sprint Review?
- ¿Hay plan B (build local, capturas, video)?
- ¿Cómo se versiona y reproduce la demo?
- ¿Qué pasa si se despliega en un dominio público y se indexa?
- ¿Hay monitoreo, logs o alertas? (No.)

### 13.6 Calidad, mantenibilidad y evolución

Hechos:

- 67 pruebas, sin E2E ni cobertura medida.
- Lógica de mock y UI acopladas por imports directos.
- Estados y mensajes centralizados en `mock-api.ts`, `estados.ts` y `format.ts`.
- `README`, especificaciones y sprint-review tienen algunas divergencias.
- Dependencias nuevas: Next 16, React 19, Tailwind 4, Vitest 4.
- Node requiere `>=20.9.0`.

Preguntas guía:

- ¿Qué se rompe al sustituir el mock por una API real?
- ¿Cómo se evita el “demo drift” entre documentación y código?
- ¿Qué pruebas deben existir antes de conectar datos reales?
- ¿Cómo se gestionan actualizaciones de dependencias mayores?
- ¿Qué deuda técnica es aceptable para un prototipo y cuál no?

### 13.7 Gestión, alcance y evidencia académica

Hechos:

- HU-01 a HU-04 están implementadas y demostradas.
- El alcance incluye extras no exigidos: simulación `STATUS`, panel de pruebas, descarga demo, rutas duplicadas.
- La DoD se reporta cumplida.
- El Kanban está al cierre con WIP 0 y throughput 4.
- La evaluación puede confundir “prototipo validado” con “sistema listo”.

Preguntas guía:

- ¿Los extras strengthen o diluyen la evidencia de las HU?
- ¿Qué riesgos de expectativa existen frente a stakeholders?
- ¿Qué debe quedar explícito en la Sprint Review sobre lo simulado?
- ¿Cómo se preserva la trazabilidad requisito → prueba → evidencia?

### 13.8 Dependencias y cadena de suministro

Hechos:

- Next.js 16, React 19 y Tailwind 4 son versiones recientes.
- No hay auditoría de dependencias en la suite.
- No hay CSP.
- El despliegue puede usar Vercel.

Preguntas guía:

- ¿Hay vulnerabilidades conocidas en las versiones fijadas?
- ¿Qué ocurre si una dependencia cambia de comportamiento?
- ¿Cómo se protege el build y el despliegue?

---

## 14. Brechas y contradicciones detectadas

| # | Hallazgo | Evidencia | Relevancia |
| --- | --- | --- | --- |
| 1 | No se usa MSW ni HTTP; los códigos son retornos de función | `src/lib/mock-api.ts` | El prototipo no prueba integración de red real |
| 2 | La autenticación es simulada y el token no se verifica | `src/lib/mock-data.ts`, `login-screen.tsx` | No hay control de acceso real |
| 3 | Los datos de otro estudiante están en el bundle | `mock-data.ts` importado en cliente | Fuga potencial si se usa con datos reales |
| 4 | El 403 exacto revela existencia de códigos ajenos | `mock-api.ts` líneas 117–128 | Oráculo de enumeración, exigido por la spec |
| 5 | El README dice que el 404 no revela existencia | `README.md` §Seguridad | Cierto sólo para búsquedas no exactas |
| 6 | `?STATUS` no está en la especificación v2 | `estados.ts`, rutas de detalle | Superficie de demo que puede inducir a error |
| 7 | La subsanación no exige todos los requisitos | `enviarSubsanacionApi` | Puede marcarse como subsanado con documentación parcial |
| 8 | El 401 se muestra como error de servicio | `useSeguimientoStore.ts` | Mala experiencia y diagnóstico incorrecto |
| 9 | No hay persistencia | `mock-api.ts` | La subsanación se pierde al recargar |
| 10 | No hay `error.tsx` ni `not-found.tsx` | `src/app/` | Un error de render no tiene contención |
| 11 | Cabeceras sin CSP/HSTS | `next.config.ts` | Protección de navegador incompleta |
| 12 | `enmascararDni` no se usa | `format.ts` | Control de privacidad disponible pero inactivo |
| 13 | No hay pruebas E2E ni de accesibilidad | `vitest.config.mts`, suite | Cobertura funcional limitada |
| 14 | `tailwind.config.js` de la spec no existe | `globals.css` | Divergencia de implementación, no de diseño |
| 15 | La descarga demo se habilita con estado simulado | `entrega-panel.tsx` + `?STATUS=FINALIZADO` | Riesgo de capturas o documentos malinterpretados |

---

## 15. Preguntas abiertas para el agente de riesgos

1. ¿El análisis debe evaluar **sólo el prototipo** o también su **hoja de ruta a producción**? Se recomienda separar ambos registros.
2. ¿La organización planea conectar este módulo a un backend real y SSO en el corto plazo? Eso cambia la prioridad de casi todos los riesgos.
3. ¿Se usarán datos personales reales en alguna demo? Si la respuesta es sí, el riesgo de privacidad sube a crítico.
4. ¿El módulo será público en internet durante la evaluación? El panel de pruebas y los datos ficticios quedarían expuestos.
5. ¿Existe un requisito de auditoría o trazabilidad institucional? No está en la especificación, pero suele ser obligatorio en sistemas académicos.
6. ¿Se exige accesibilidad WCAG AA? La paleta y los tamaños pequeños sugieren que conviene revisarlo.
7. ¿Cuál es el volumen esperado y el horario de atención? Afecta concurrencia, rendimiento y soporte.
8. ¿Quién es el dueño del dato y del trámite: Registro Académico, Mesa de Partes o Decanato? Afecta responsables y escalamiento.
9. ¿Qué pasa si el estudiante no está autenticado o su sesión expira? Hoy no hay flujo de reautenticación.
10. ¿Se aceptará el riesgo de enumeración de códigos a cambio de cumplir el criterio 1.2, o se acordará un mensaje uniforme?

---

## 16. Formato de salida esperado del análisis

### 16.1 Escalas sugeridas

**Probabilidad**

| Valor | Criterio |
| --- | --- |
| 1 | Raro |
| 2 | Improbable |
| 3 | Posible |
| 4 | Probable |
| 5 | Casi seguro |

**Impacto**

| Valor | Criterio |
| --- | --- |
| 1 | Insignificante |
| 2 | Menor |
| 3 | Moderado |
| 4 | Mayor |
| 5 | Crítico |

**Nivel** = probabilidad × impacto:

- `1–4`: Bajo
- `5–9`: Medio
- `10–14`: Alto
- `15–25`: Crítico

### 16.2 Registro de riesgos

Se recomienda una tabla con estas columnas:

| Campo | Contenido |
| --- | --- |
| `ID` | `R-001`, `R-002`… |
| `Categoría` | Seguridad, privacidad, datos, UX, calidad, operación, gestión |
| `Activo` | Módulo, dato, proceso o evidencia afectada |
| `Riesgo` | “Que ocurra X y provoque Y” |
| `Causa` | Hecho o brecha concreta |
| `Probabilidad` | 1–5 |
| `Impacto` | 1–5 |
| `Nivel` | Bajo / Medio / Alto / Crítico |
| `Mitigación` | Preventiva, detectiva o correctiva |
| `Responsable` | Rol, no persona |
| `Evidencia` | Prueba, documento o control verificable |
| `Estado` | Abierto, en tratamiento, aceptado, cerrado |

### 16.3 Ejemplo de fila

| ID | Categoría | Riesgo | Causa | P | I | Nivel | Mitigación | Responsable | Evidencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | Seguridad | Un estudiante podría ver trámites ajenos si el filtro se traslada a producción sin control de servidor | El aislamiento se ejecuta en cliente | 3 | 5 | 15 | Mover autorización a API, validar `estudianteId` contra sesión y prueba E2E negativa | Arquitectura + Backend | Prueba de integración 403 |

### 16.4 Entregables mínimos sugeridos

1. Resumen ejecutivo con los 5 riesgos principales.
2. Registro completo priorizado.
3. Mapa de calor.
4. Plan de mitigación por horizonte: antes de la Sprint Review, antes de piloto y antes de producción.
5. Riesgos aceptados con justificación.
6. Trazabilidad a HU y a la DoD.
7. Preguntas abiertas y supuestos.

---

## 17. Anexos

### 17.1 Mapa de archivos relevante

```text
src/
├── app/
│   ├── page.tsx
│   ├── globals.css
│   ├── mis-tramites/page.tsx
│   ├── mis-tramites/[codigo]/page.tsx
│   └── campusvirtual/mis-tramites/...
├── components/
│   ├── seguimiento-app.tsx
│   ├── search-form.tsx
│   ├── demo-panel.tsx
│   ├── resultado-solicitud.tsx
│   ├── status-card.tsx
│   ├── timeline-stepper.tsx
│   ├── documents-panel.tsx
│   ├── document-upload-zone.tsx
│   ├── entrega-panel.tsx
│   ├── solicitud-card.tsx
│   ├── states/
│   └── ui/
├── lib/
│   ├── mock-api.ts
│   ├── mock-data.ts
│   ├── types.ts
│   ├── estados.ts
│   ├── timeline.ts
│   ├── format.ts
│   └── utils.ts
└── store/
    └── useSeguimientoStore.ts
```

### 17.2 Glosario

| Término | Significado |
| --- | --- |
| HU | Historia de Usuario |
| DoD | Definición de Terminado |
| RBAC | Control de acceso basado en roles |
| SSO | Inicio de sesión único |
| WIP | Trabajo en curso |
| Mock | Datos o servicio simulado |
| 403 | Prohibido; en este prototipo, solicitud ajena |
| 404 | No encontrado; código inexistente para la cuenta |
| 500 | Error interno simulado |
| `estudianteId` | Clave de aislamiento de datos |
| `STATUS` | Query param de demo para forzar estado |

### 17.3 Evidencia rápida

- Suite: `npm test` → 67/67.
- Demo: `/mis-tramites` y `/campusvirtual/mis-tramites`.
- Guion completo: `docs/sprint-review.md`.
- Especificación vigente: `especificaciones_v2.md`.
- Especificación inicial: `especificaciones.md`.
- Guía de uso: `README.md`.

### 17.4 Advertencia final

El prototipo demuestra correctamente el flujo, la identidad visual y el aislamiento **funcional**. No demuestra seguridad de producción, persistencia, autenticación real ni cumplimiento normativo. Cualquier conclusión del análisis de riesgos debe explicitar si se refiere al prototipo evaluado o a la solución que se construiría a partir de él.
