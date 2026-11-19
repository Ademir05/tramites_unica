# Seguimiento de Trámites Académicos · Campus Virtual UNICA

Prototipo de alta fidelidad del módulo **Seguimiento de Trámites Académicos** de
la Universidad Nacional “San Luis Gonzaga” de Ica (UNICA). Implementa las
Historias de Usuario **HU-01 a HU-04** de la especificación v2, con identidad
visual naranja/blanco, sesión simulada del Campus Virtual y aislamiento estricto
de datos por estudiante.

## Demo rápida

```bash
npm install
npm run dev
```

Abrir <http://localhost:3000> o la ruta del módulo:
<http://localhost:3000/mis-tramites>. La ruta institucional equivalente es
<http://localhost:3000/campusvirtual/mis-tramites>.

### Rutas por trámite y simulación de estados

Cada trámite tiene una URL propia:

```text
/mis-tramites/SOL-UNICA-2026-001
/mis-tramites/SOL-UNICA-2026-003
/mis-tramites/SOL-UNICA-2026-004
/mis-tramites/SOL-UNICA-2026-005
```

También están disponibles bajo el prefijo del Campus Virtual, por ejemplo
`/campusvirtual/mis-tramites/SOL-UNICA-2026-001`.

El query param `STATUS` permite forzar el estado únicamente en una ruta por
trámite. Acepta el valor con o sin comillas, en mayúsculas o minúsculas:

```text
/mis-tramites/SOL-UNICA-2026-001?STATUS=FINALIZADO
/mis-tramites/SOL-UNICA-2026-003?STATUS="FIRMA_DIGITAL"
/mis-tramites/SOL-UNICA-2026-004?STATUS=PENDIENTE_DOCUMENTOS
```

Valores admitidos: `EN_EVALUACION`, `PENDIENTE_DOCUMENTOS`, `FIRMA_DIGITAL` y
`FINALIZADO`. También se aceptan alias como `EN_PROCESO`, `EN EVALUACIÓN`,
`PENDIENTE DE DOCUMENTOS`, `FIRMA` y `LISTO_PARA_ENTREGA`. La interfaz muestra
un aviso de **Modo demo** y un enlace para ver el estado real. Un valor inválido
no altera el trámite.

La sesión activa simulada es:

- **Estudiante:** Ana Lucia Mendoza
- **Código universitario:** `20221045`
- **Facultad:** Ingeniería de Sistemas - UNICA

El botón **Cerrar sesión** muestra el flujo de salida del Campus Virtual y
permite volver a ingresar con la sesión SSO simulada.

### Casos de prueba incluidos

| Caso | Entrada | Resultado esperado |
| --- | --- | --- |
| Listado propio | Ingreso al módulo | Se listan automáticamente los 4 trámites de Ana, sin datos de terceros |
| En evaluación | `SOL-UNICA-2026-001` | Estado **En Evaluación**, área responsable, siguiente paso y última actualización |
| Documentos pendientes | `SOL-UNICA-2026-003` | Banner ámbar, requisitos faltantes y zona de carga Drag & Drop |
| Firma digital | `SOL-UNICA-2026-004` | Fase **Firma Digital** activa en el stepper |
| Finalizado | `SOL-UNICA-2026-005` | Todas las fases completas y panel de entrega con descarga demo |
| Solicitud ajena | `SOL-UNICA-2026-002` o `SOL-UNICA-2026-099` | Bloqueo **403** sin exponer datos de la otra cuenta |
| Búsqueda por tipo | `Certificado` o `Constancia` | Filtra solo coincidencias propias |
| Código inexistente | `SOL-000-XXXX` | Aviso **404** con el mensaje exacto de la especificación |
| Falla del servicio | **Probar error 500** o interruptor de simulación | Pantalla de contingencia neutra con botón naranja **Reintentar** |

El **Panel de pruebas · Sprint Review UNICA** permite cargar cada caso con un
clic, buscar por tipo y activar/desactivar la caída simulada del servicio.

### Mensajes exactos implementados

- **403:** «Acceso restringido: Esta solicitud no pertenece a tu cuenta
  institucional»
- **404:** «No se encontró ninguna solicitud asociada a tu cuenta con ese
  código»
- **500:** «Servicio no disponible momentáneamente.» con acción **Reintentar**

## Historias de Usuario implementadas

| HU | Sprint | Implementación | Evidencia |
| --- | --- | --- | --- |
| **HU-01** Consultar trámites propios | 1 | Listado automático por `estudianteId`, búsqueda por código o tipo, 200/403/404/500 | `mock-api.test.ts`, `seguimiento-app.test.tsx` |
| **HU-02** Área y siguiente paso | 1 | `TimelineStepper` con oficina responsable y acción esperada | `timeline.test.ts`, integración UI |
| **HU-03** Documentos observados | 2 | Banner ámbar, requisitos y carga Drag & Drop con validación, progreso y subsanación | `useSeguimientoStore.test.ts`, integración UI |
| **HU-04** Última actualización | 2 | Etiqueta visible «Última actualización: 12/11/2026, 11:20 AM» en las tarjetas | `format.test.ts`, integración UI |

### Criterios de aceptación cubiertos

- **1.1 Listado propio:** al ingresar se cargan solo los trámites de
  `20221045`, con la paleta UNICA y sus estados.
- **1.2 Acceso a solicitud ajena:** un código de otro estudiante devuelve 403 y
  el mensaje exacto, sin datos del titular.
- **1.3 Código inexistente:** se muestra el aviso 404 exacto, con opción para
  volver al listado.
- **1.4 Falla del servicio:** pantalla de contingencia en tonos neutros con
  botón naranja **Reintentar**.
- **2.1 Área y siguiente paso:** visible en cada detalle, junto con el stepper
  de cuatro fases: Registrado, En Evaluación, Firma Digital y Listo para
  Entrega.
- **3.1 Subsanación:** alerta ámbar con los requisitos y carga de PDF/JPG/PNG.
- **4.1 Fecha:** etiqueta compacta con el formato exigido por HU-04.

## Seguridad y aislamiento de datos

- La sesión simulada se gestiona con **Zustand** (`sesion`) e incluye
  `estudianteId`, nombre, código, facultad y `tokenSimulado`.
- El listado, la búsqueda y la subsanación se filtran siempre por
  `estudianteId`.
- Si el código existe pero pertenece a otra cuenta, la API responde **403**
  antes de devolver cualquier datos.
- Si el término no coincide con un trámite propio, responde **404**; no se
  revela si el código existe en otra cuenta.
- Al cerrar sesión se limpian solicitudes, selección, archivos y mensajes; el
  módulo queda bloqueado hasta volver a ingresar.
- La base ficticia incluye registros adicionales de demostración (`004` y
  `005`, propios) y dos registros ajenos (`002` y `099`) para validar el
  control de acceso.

## Arquitectura

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Lenguaje | TypeScript 5 estricto |
| Estilos | Tailwind CSS 4 + componentes estilo Shadcn UI |
| Estado y sesión | Zustand 5 |
| Iconografía | Lucide React |
| Mocking | Módulo local con latencia y respuestas HTTP simuladas 200/403/404/500 |
| Pruebas | Vitest 4 + Testing Library + jsdom |

```text
src/
├── app/
│   ├── mis-tramites/
│   │   ├── page.tsx                     # Listado de trámites
│   │   └── [codigo]/page.tsx            # Ruta directa por trámite
│   ├── campusvirtual/mis-tramites/
│   │   ├── page.tsx                     # Alias institucional del listado
│   │   └── [codigo]/page.tsx            # Alias institucional por trámite
│   ├── globals.css        # Tokens UNICA, fondo y animaciones
│   ├── layout.tsx         # Metadatos, tipografía Inter y layout raíz
│   └── page.tsx           # Entrada de demostración del Campus Virtual
├── components/
│   ├── layout/            # Header, footer, login simulado y composición del portal
│   ├── states/            # Carga, vacío, 403, 404 y contingencia 500
│   ├── ui/                # Button, Badge, Card, Input, Alert, Progress, Switch, Skeleton
│   ├── demo-panel.tsx     # Casos de Sprint Review
│   ├── documents-panel.tsx
│   ├── document-upload-zone.tsx
│   ├── entrega-panel.tsx
│   ├── resultado-solicitud.tsx
│   ├── search-form.tsx
│   ├── seguimiento-app.tsx
│   ├── solicitud-card.tsx
│   ├── status-badge.tsx
│   ├── status-card.tsx
│   └── timeline-stepper.tsx
├── lib/
│   ├── estados.ts         # Metadatos visuales por estado
│   ├── format.ts          # Fechas en español, formato corto y tamaños
│   ├── mock-api.ts        # API segura, 403/404/500 y persistencia en memoria
│   ├── mock-data.ts       # Sesión, base ficticia y casos de demo
│   ├── timeline.ts        # Fases y avance del trámite
│   ├── types.ts           # `EstudianteSesion` y `SolicitudUNICA`
│   └── utils.ts           # `cn`
└── store/
    └── useSeguimientoStore.ts # Sesión, búsqueda, selección, adjuntos y subsanación
```

### Flujo de estados

```text
EN_EVALUACION          → fase actual: En Evaluación
PENDIENTE_DOCUMENTOS   → evaluación observada + panel de documentos
FIRMA_DIGITAL          → fase actual: Firma Digital
FINALIZADO             → todas las fases completas + panel de entrega

Subsanación exitosa    → EN_EVALUACION + documentos recibidos + timestamp actualizado
```

### Reglas de la carga de documentos

- Formatos: PDF, JPG o PNG.
- Tamaño máximo: 5 MB por archivo.
- Se rechazan archivos vacíos y duplicados.
- El progreso es simulado; no se envían datos reales.
- La subsanación se habilita cuando todos los archivos están cargados.
- La API vuelve a validar la titularidad antes de actualizar la solicitud.

## Scripts

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Compilación de producción
npm start          # Servidor de producción
npm run lint       # ESLint
npm test           # Pruebas automatizadas
npx tsc --noEmit   # Verificación de tipos
```

## Pruebas automatizadas

```text
Test Files  6 passed (6)
Tests       67 passed (67)
```

| Archivo | Cobertura |
| --- | --- |
| `src/lib/estados.test.ts` | Parseo de `STATUS`, alias de estados y coherencia del estado simulado |
| `src/lib/format.test.ts` | Fecha completa y compacta de HU-04, tiempo relativo y tamaños |
| `src/lib/timeline.test.ts` | Cuatro fases, estado actual, firma digital y porcentajes |
| `src/lib/mock-api.test.ts` | Listado propio, búsqueda por tipo, 403, 404, 500, persistencia y subsanación |
| `src/store/useSeguimientoStore.test.ts` | Sesión, listado, filtros, selección, validaciones, progreso y cierre de sesión |
| `src/components/seguimiento-app.test.tsx` | Integración UI: rutas por trámite, `STATUS`, listado, 403, 404, 500, carga, entrega y login/logout |

## Sprint y Kanban

- **Sprint 1:** estructura del Campus Virtual, sesión, identidad UNICA, HU-01 y
  HU-02.
- **Sprint 2:** HU-03, HU-04, pruebas de aislamiento 403 y demostración final.

| Columna | Límite WIP | Estado al cierre |
| --- | --- | --- |
| Por hacer | — | Sin elementos |
| En curso | 2 | Sin elementos |
| En revisión | 1 | Sin elementos |
| Terminado | — | HU-01, HU-02, HU-03, HU-04 |

Métricas observadas: WIP final `0`, throughput `4` historias, una iteración por
historia y edad de elemento `0` para los elementos terminados.

### Definición de Terminado

- [x] Identidad visual UNICA naranja/blanco aplicada en todo el módulo.
- [x] Código integrado y sin errores críticos (`build`, `lint` y `tsc`
  exitosos).
- [x] Listado y consultas limitados al `estudianteId` de la sesión.
- [x] Intento de acceso a solicitud ajena verificado con 403.
- [x] Casos exitosos, código inexistente y falla simulada probados con datos
  ficticios.
- [x] Evidencia demostrable en [`docs/sprint-review.md`](docs/sprint-review.md).

## Despliegue en Vercel

El proyecto está listo para desplegarse como aplicación Next.js en Vercel.

### Desde el dashboard

1. Importar el repositorio en Vercel.
2. Mantener el framework detectado: **Next.js**.
3. Usar los comandos definidos en `vercel.json`:
   - Install: `npm ci`
   - Build: `npm run build`
4. No se requieren variables de entorno.
5. Desplegar. Las rutas dinámicas y `/robots.txt` se generan automáticamente.

### Desde la CLI

```bash
npm install -g vercel
vercel
vercel --prod
```

### Configuración incluida

- `vercel.json` fija el framework y los comandos de instalación/compilación.
- `package.json` declara compatibilidad con Node.js `>=20.9.0`.
- `next.config.ts` desactiva `X-Powered-By` y agrega cabeceras de seguridad:
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y
  `Permissions-Policy`.
- `src/app/robots.ts` publica `robots.txt` con `Disallow: /` para evitar
  indexación del prototipo.
- Los metadatos incluyen `robots: noindex, nofollow`.

> **Importante:** al ser un prototipo, la sesión, los datos y la carga de
> archivos son simulados en el navegador. Vercel no ejecuta un backend real y
> los cambios en memoria se reinician al recargar la página. No usar con datos
> personales reales.

## Limitaciones del prototipo

- Los datos viven en memoria: recargar la página restaura la base ficticia.
- No existe SSO ni backend real; la sesión y el token JWT son simulados.
- La descarga de la constancia y la carga de archivos son simuladas.
- El módulo es una demostración de validación UX, no un sistema de producción.

Ver [`docs/sprint-review.md`](docs/sprint-review.md) para el guion completo y la
matriz de evidencias.
