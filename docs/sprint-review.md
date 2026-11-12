# Sprint Review · Seguimiento de Trámites Académicos · UNICA

Guion de demostración y matriz de evidencias del prototipo de alta fidelidad
integrado al **Campus Virtual UNICA**. Cubre HU-01 a HU-04, el aislamiento de
datos por estudiante y la Definición de Terminado de la especificación v2.

## 1. Preparación

```bash
npm install
npm run dev
```

Abrir <http://localhost:3000> o <http://localhost:3000/campusvirtual/mis-tramites>.

Sesión simulada:

- Ana Lucia Mendoza
- Código `20221045`
- Ingeniería de Sistemas - UNICA

Para validar la compilación de producción:

```bash
npm run build
npm start
```

## 2. Guion de demostración

### Escenario 1 · Ingreso y listado propio (HU-01)

1. Abrir el módulo. La sesión de Ana Lucia Mendoza ya está activa.
2. Verificar que el listado se carga automáticamente con **4 trámites propios**:
   `001`, `003`, `004` y `005`.
3. Señalar que no aparecen `002` ni `099`, que pertenecen a otra cuenta.
4. Identificar la paleta UNICA: barra naranja `#FF6600`, fondos blancos y
   neutros, y badges de estado.

### Escenario 2 · Consulta exitosa y área responsable (HU-01, HU-02, HU-04)

1. Buscar `SOL-UNICA-2026-001`.
2. Abrir el detalle y verificar:
   - Trámite **Constancia de Estudios 2026-II** con badge **En Evaluación**.
   - Etiqueta **Última actualización: 12/11/2026, 11:20 AM** en la cabecera.
   - Estudiante **Ana Lucia Mendoza**, código `20221045`.
   - Stepper con **En Evaluación** activa y **38% completado**.
   - **Área responsable actual: Oficina de Registro y Asuntos Académicos**.
   - **Siguiente paso: Verificación de requisitos de matrícula**.
3. Señalar el panel lateral con los canales oficiales de atención de la UNICA.

### Escenario 3 · Documentos pendientes y subsanación (HU-03, HU-04)

1. Consultar `SOL-UNICA-2026-003` o hacer clic en el caso **Documentos** del
   panel de pruebas.
2. Verificar:
   - Badge **Pendiente de Documentos** y stepper con **Acción requerida**.
   - Banner ámbar con **Foto de DNI legible (Ambas caras)** y
     **Voucher de pago Banco de la Nación**.
   - Zona Drag & Drop con formatos y límite de 5 MB.
3. Intentar adjuntar un archivo `.txt` para demostrar la validación.
4. Adjuntar un PDF o JPG válido y observar el progreso simulado hasta
   **Archivo cargado**.
5. Presionar **Enviar subsanación**.
6. Verificar:
   - Confirmación **Subsanación enviada** con badge **En revisión**.
   - Lista de **Documentos recibidos**.
   - El estado vuelve a **En Evaluación** y se actualiza la fecha de la tarjeta.

### Escenario 4 · Intento de acceso a solicitud ajena (HU-01, criterio 1.2)

1. En el panel de pruebas, hacer clic en `SOL-UNICA-2026-002` o buscar ese
   código manualmente.
2. Verificar el bloqueo:
   > Acceso restringido: Esta solicitud no pertenece a tu cuenta institucional
3. Confirmar que no aparece el trámite **Certificado de Notas** de la otra
   cuenta ni ningún dato del titular.
4. Presionar **Volver a mis trámites** y comprobar que se recupera el listado
   propio.

### Escenario 5 · Código inexistente (HU-01, criterio 1.3)

1. Hacer clic en `SOL-000-XXXX` o buscarlo manualmente.
2. Verificar el aviso:
   > No se encontró ninguna solicitud asociada a tu cuenta con ese código
3. Señalar que la búsqueda solo opera sobre las solicitudes propias y que se
   ofrece **Ver todos mis trámites**.

### Escenario 6 · Falla del servicio y reintento (HU-01, criterio 1.4)

1. Presionar **Probar error 500** o activar **Simular caída del servicio** y
   consultar un código propio.
2. Verificar la pantalla de contingencia en tonos neutros:
   > Servicio no disponible momentáneamente.
3. Presionar **Desactivar simulación y reintentar** o desactivar el interruptor
   y usar **Reintentar**.
4. Verificar que la consulta se recupera y muestra el trámite.

### Escenario 7 · Firma digital (HU-02)

1. Consultar `SOL-UNICA-2026-004`.
2. Verificar:
   - Badge **Firma Digital** y fase actual **Firma Digital**.
   - **Siguiente paso: Firma digital y autorización del documento**.
   - Avance de **63% completado**.

### Escenario 8 · Trámite finalizado y entrega (HU-01, HU-04)

1. Consultar `SOL-UNICA-2026-005`.
2. Verificar:
   - Badge **Finalizado** y stepper al **100% completado**.
   - Panel **Tu documento está listo** con badge **Listo para entrega**.
   - Datos de recojo, horario y requisito.
3. Presionar **Descargar constancia (demo)** y comprobar la descarga del archivo
   ficticio `.txt`.

### Escenario 9 · Búsqueda por tipo y cierre de sesión

1. Buscar `Certificado`. Verificar que solo aparecen los trámites propios
   `003` y `004`; no se incluye el `002` ajeno.
2. Presionar **Limpiar filtro** y comprobar que vuelve el listado completo.
3. Presionar **Cerrar sesión** y verificar la pantalla **Sesión finalizada**.
4. Presionar **Ingresar con Campus Virtual UNICA** y comprobar que se restaura
   la sesión y el listado propio.

## 3. Matriz de evidencias

| Criterio | Verificación manual | Prueba automatizada |
| --- | --- | --- |
| 1.1 Listado y consulta propia | Escenarios 1 y 2 | `mock-api.test.ts` · «lista automáticamente solo…»; `seguimiento-app.test.tsx` · «lista automáticamente…» |
| 1.2 Solicitud ajena 403 | Escenario 4 | `mock-api.test.ts` · «bloquea con 403 exacto…»; `useSeguimientoStore.test.ts` · «bloquea la solicitud ajena…»; integración UI |
| 1.3 Código inexistente 404 | Escenario 5 | `mock-api.test.ts` · «responde 404…»; integración UI |
| 1.4 Falla del servicio 500 | Escenario 6 | `mock-api.test.ts` · «responde 500…»; integración UI con reintento |
| 2.1 Área y siguiente paso | Escenario 2 | `timeline.test.ts`; integración UI |
| 3.1 Documentos y carga | Escenario 3 | `useSeguimientoStore.test.ts`; integración UI |
| 4.1 Fecha de actualización | Escenarios 2 y 3 | `format.test.ts` · formato compacto exacto |
| Firma digital | Escenario 7 | `timeline.test.ts`; integración UI |
| Entrega finalizada | Escenario 8 | integración UI |
| Cierre y restauración de sesión | Escenario 9 | `useSeguimientoStore.test.ts`; integración UI |
| Búsqueda por tipo | Escenario 9 | `mock-api.test.ts`; integración UI |

Ejecución de la suite:

```text
Test Files  5 passed (5)
Tests       54 passed (54)
```

Comandos de verificación:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## 4. Tablero Kanban al cierre

| Columna | Límite WIP | Elementos |
| --- | --- | --- |
| Por hacer | — | — |
| En curso | 2 | — |
| En revisión | 1 | — |
| Terminado | — | HU-01, HU-02, HU-03, HU-04 |

Métricas de flujo del prototipo:

- **WIP final:** 0.
- **Throughput:** 4 historias completadas (2 por Sprint).
- **Tiempo de ciclo:** una iteración por historia.
- **Edad del elemento:** 0 para los elementos terminados.

## 5. Definición de Terminado

| Requisito | Evidencia | Estado |
| --- | --- | --- |
| Sistema de diseño UNICA naranja/blanco | Header, tarjetas, botones, badges y tokens `unica-*` | Cumplido |
| Aislamiento por `estudianteId` | Filtro de API, store y pruebas de 403 | Cumplido |
| Respuesta a acceso no autorizado | Pantalla **Acceso restringido** con mensaje exacto | Cumplido |
| Código integrado y libre de errores críticos | `npm run build`, `npm run lint`, `npx tsc --noEmit` | Cumplido |
| Criterios Dado/Cuando/Entonces verificados | 54 pruebas automatizadas + guion manual | Cumplido |
| Casos exitoso, inexistente, 403 y error 500 | Panel de pruebas + suite de API/UI | Cumplido |
| Evidencia lista para Sprint Review | Este documento + demo interactiva | Cumplido |

## 6. Notas para la revisión

- La base ficticia se restaura al recargar la página; la subsanación persiste
  solo durante la sesión en memoria.
- Los registros `004` y `005` son añadidos de demostración para exponer los
  estados **Firma Digital** y **Finalizado**; `002` y `099` pertenecen a otra
  cuenta y se usan para validar el 403.
- El SSO, el token JWT, la carga de archivos y la descarga de constancia son
  simulados.
- No existe backend real ni autenticación de producción; el prototipo está
  orientado a validación UX y de seguridad funcional.
