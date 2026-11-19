# Análisis de Riesgos y Mitigaciones · Seguimiento de Trámites Académicos UNICA

> **Estado del documento: v0.2 — cerrado para entrega.**
> La estructura, las categorías y los riesgos candidatos se derivan de
> `docs/contexto-analisis-riesgos.md` (superficies 13.1–13.8 y brechas 1–15).
> Las valoraciones `P`, `I` y `Nivel` son propuestas del equipo y quedan
> sujetas a revisión en la defensa.

| Campo | Valor |
| --- | --- |
| Versión | 0.2 |
| Fecha | 19 de noviembre de 2026 |
| Insumo principal | `docs/contexto-analisis-riesgos.md` v1.0 |
| Evidencia ejecutable | `npm test` (67/67), `npm run lint`, `npx tsc --noEmit`, `npm run build` — verificados 19/11/2026 |
| Alcance | Prototipo actual **y** hoja de ruta a producción (registros separados) |
| Autor | Equipo del proyecto |
| Revisores | Docente asesor |

---

## 1. Resumen ejecutivo

El módulo de Seguimiento de Trámites Académicos es un prototipo de alta fidelidad
que implementa las HU-01 a HU-04 sobre datos ficticios y una sesión simulada. Su
estado es apto para validación de experiencia, flujo y aislamiento funcional, pero
**no** para operar con datos personales reales: la autorización se ejecuta en el
cliente, la base ficticia completa viaja en el bundle y no existe verificación de
sesión ni auditoría persistente.

El análisis distingue dos registros. El **Registro A** cubre los riesgos del
prototipo actual y se cierra casi por completo con acciones de bajo coste
(documentación de límites, marca de agua en la constancia, enmascaramiento de DNI).
El **Registro B** cubre la puesta en producción y exige backend con RBAC, SSO
institucional, auditoría, persistencia y control de archivos. La conclusión es que
la brecha entre ambos no es de interfaz, sino de arquitectura.

### 1.1 Los cinco riesgos principales

| ID | Riesgo | Nivel |
| --- | --- | --- |
| R-003 | Sesión simulada y token no verificado, trasladables a producción | Crítico (25) |
| R-002 | Datos de otro estudiante incluidos en el bundle del cliente | Crítico (20) |
| R-006 | Ausencia de auditoría persistente de accesos y cambios | Alto (16) |
| R-001 | Autorización ejecutada solo en cliente | Crítico (15) |
| R-008 | Estado del cliente manipulable para alterar la vista | Alto (12) |

### 1.2 Mensaje clave

El prototipo es **apto para demostración académica y validación de UX**, y
**no apto para datos reales** hasta cerrar R-001, R-002, R-003 y R-006. Esa
brecha está cuantificada en el Registro B y en el plan de mitigación de la
sección 7; no requiere rehacer la interfaz, sino añadir la capa de servidor.

---

## 2. Alcance, método y supuestos

### 2.1 Alcance

- **Registro A:** riesgos del prototipo tal como está implementado hoy.
- **Registro B:** riesgos de la eventual puesta en producción (backend, SSO, datos reales).
- Fuera de alcance: infraestructura institucional de la UNICA, sistemas de origen
  (Aula Virtual, Mesa de Partes) y su configuración.

### 2.2 Método

1. Inventario de activos y superficies (contexto §13).
2. Identificación de riesgos a partir de hechos verificables del código.
3. Valoración `Nivel = P × I` con las escalas del contexto §16.1.
4. Definición de mitigación preventiva / detectiva / correctiva.
5. Asignación de responsable por rol y evidencia verificable.

### 2.3 Supuestos

Heredados del contexto §12. Se destacan:

- El prototipo **no** maneja datos reales ni se despliega como servicio institucional.
- No existe backend ni control de servidor.
- La sesión es única (`20221045`) y conocida.
- La persistencia es efímera.
- El objetivo es académico: validar UX y aislamiento funcional.

> **Regla:** si cualquiera de estos supuestos deja de cumplirse (datos reales,
> dominio público, conexión a la API institucional), el riesgo sube de nivel y
> debe reevaluarse el registro completo.

---

## 3. Escalas

### 3.1 Probabilidad

| Valor | Criterio |
| --- | --- |
| 1 | Raro |
| 2 | Improbable |
| 3 | Posible |
| 4 | Probable |
| 5 | Casi seguro |

### 3.2 Impacto

| Valor | Criterio |
| --- | --- |
| 1 | Insignificante |
| 2 | Menor |
| 3 | Moderado |
| 4 | Mayor |
| 5 | Crítico |

### 3.3 Nivel

| Rango | Nivel |
| --- | --- |
| 1–4 | Bajo |
| 5–9 | Medio |
| 10–14 | Alto |
| 15–25 | Crítico |

---

## 4. Registro A · Riesgos del prototipo actual

> Columnas conforme al contexto §16.2. `Estado` inicial: **Abierto**.
> La columna `Mitigación` describe la acción; el detalle va en la sección 7.

### 4.1 Seguridad y control de acceso

| ID | Categoría | Activo | Riesgo | Causa | P | I | Nivel | Mitigación | Responsable | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | Seguridad | Datos de trámites | Que un estudiante vea trámites ajenos si el filtro se traslada tal cual a producción | Aislamiento en cliente (`src/lib/mock-api.ts` L103-105) | 3 | 5 | Crítico (15) | Mover autorización al servidor y validar `estudianteId` contra la sesión | Arquitectura + Backend | Prueba E2E negativa 403 | Abierto |
| R-002 | Seguridad / Privacidad | Bundle del cliente | Que la base completa, incluida la de otro estudiante, se descargue al navegador | `mock-data.ts` importado en componentes cliente | 4 | 5 | Crítico (20) | Sustituir por API; nunca incluir datos ajenos en el bundle | Frontend + Backend | Inspección del bundle / `grep` en build | Abierto |
| R-003 | Seguridad | Sesión | Que la sesión hardcodeada y el token no verificado pasen a producción | `CURRENT_STUDENT_SESSION` en `mock-data.ts`; `tokenSimulado` sin uso | 5 | 5 | Crítico (25) | Integrar SSO real, validar token en servidor y eliminar credenciales fijas | Arquitectura + Backend | Prueba de token inválido = 401 | Abierto |
| R-004 | Seguridad | Enumeración de códigos | Que el 403 exacto permita descubrir qué códigos existen | `mock-api.ts` L117-128 distingue existente-ajeno de inexistente | 4 | 2 | Medio (8) | Evaluar mensaje uniforme 404/403 o limitar intentos; decisión de producto | Producto + Seguridad | Prueba de enumeración / decisión documentada | Abierto |
| R-005 | Seguridad | API simulada | Que no haya límite de intentos ante automatización | Sin rate limiting (no hay servidor) | 3 | 3 | Medio (9) | Rate limiting y bloqueo progresivo en la API real | Backend | Prueba de carga / configuración | Abierto |
| R-006 | Seguridad | Trazabilidad | Que no se pueda reconstruir quién consultó o modificó una solicitud | Sin auditoría persistente | 4 | 4 | Alto (16) | Log de auditoría inmutable con usuario, acción, código y timestamp | Backend + Seguridad | Consulta de auditoría de prueba | Abierto |
| R-007 | Seguridad / UX | Sesión expirada | Que el 401 se muestre como error de servicio y no reautentique | `useSeguimientoStore.ts` trata 401 como fallo genérico | 3 | 3 | Medio (9) | Flujo de reautenticación y mensaje diferenciado | Frontend | Prueba de sesión expirada | Abierto |
| R-008 | Seguridad | Estado del cliente | Que el estado de Zustand se manipule desde el navegador para alterar la vista | Estado global en cliente sin validación de servidor | 3 | 4 | Alto (12) | Revalidar en servidor; el cliente nunca decide autorización | Frontend + Backend | Prueba de manipulación de store | Abierto |
| R-009 | Seguridad / Confianza | Constancia demo | Que la constancia ficticia se confunda con un documento oficial | `entrega-panel.tsx` habilita descarga con `?STATUS=FINALIZADO` | 2 | 3 | Medio (6) | Marca de agua “DEMO” implementada + nombre de archivo explícito + bloqueo en producción | Producto | `entrega-panel.tsx` y archivo descargado | En tratamiento |

### 4.2 Privacidad y cumplimiento

| ID | Categoría | Activo | Riesgo | Causa | P | I | Nivel | Mitigación | Responsable | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-010 | Privacidad | Datos personales | Que se muestren más datos de los necesarios sin aviso de privacidad | Nombre, código, facultad y trámites visibles; sin aviso ni retención | 4 | 3 | Alto (12) | Minimización, aviso de privacidad y base legal documentada | Producto + Legal | Revisión de la vista y aviso publicado | Abierto |
| R-011 | Privacidad | DNI | Que el DNI se muestre completo cuando existe función de enmascaramiento | `format.ts` define `enmascararDni` sin uso | 3 | 2 | Medio (6) | Aplicar enmascaramiento en toda vista y log | Frontend | Prueba de formato / revisión visual | Abierto |
| R-012 | Privacidad | Archivos | Que al implementar carga real no haya antivirus, cuarentena ni retención | Hoy solo se guarda el nombre del archivo | 2 | 5 | Alto (10) | Antivirus, cuarentena, cifrado y política de retención antes de producción | Backend + Seguridad | Prueba de archivo malicioso rechazado | Abierto |
| R-013 | Privacidad / Operación | Demo pública | Que la demo se indexe o exponga el panel de pruebas y datos ficticios | `robots.ts` existe, pero no hay control de acceso a la demo | 3 | 3 | Medio (9) | `noindex`, URL no listada y panel de pruebas solo en modo demo | DevOps | Revisión de `robots` y acceso | Abierto |

### 4.3 Integridad de datos y reglas de negocio

| ID | Categoría | Activo | Riesgo | Causa | P | I | Nivel | Mitigación | Responsable | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-014 | Datos | Subsanación | Que se marque como subsanado con documentación incompleta | `enviarSubsanacionApi` no exige cubrir todos los requisitos | 4 | 3 | Alto (12) | Validar requisitos completos y asociación archivo ↔ requisito | Backend | Prueba de subsanación parcial rechazada | Abierto |
| R-015 | Datos | Expediente | Que no se pueda verificar qué archivo cubre qué requisito | No hay asociación archivo ↔ requisito | 4 | 2 | Medio (8) | Modelo de datos con relación explícita | Backend | Esquema y prueba de integridad | Abierto |
| R-016 | Datos | Fecha de actualización | Que la fecha se genere en cliente y difiera de la real por zona horaria | `formatearFechaApi` en cliente | 3 | 3 | Medio (9) | Fecha autoritativa del servidor en UTC y formato institucional | Backend + Frontend | Prueba de zona horaria | Abierto |
| R-017 | Datos | Estado del trámite | Que `?STATUS` llegue a producción y permita forzar estados | `estados.ts` y rutas de detalle | 2 | 4 | Medio (8) | Compilar la simulación solo en modo demo (`NODE_ENV`) | Frontend | Build de producción sin `STATUS` | Abierto |
| R-018 | Datos | Persistencia | Que la subsanación se pierda al recargar y se interprete como fallo | Base en memoria (`mock-api.ts` L44-46) | 4 | 2 | Medio (8) | Persistencia real y confirmación de guardado | Backend | Prueba de recarga | Abierto |
| R-019 | Datos | Concurrencia | Que dos pestañas o usuarios sobrescriban la misma solicitud | Sin control de versión ni bloqueo | 2 | 3 | Medio (6) | Control optimista de versión y auditoría | Backend | Prueba de concurrencia | Abierto |

### 4.4 UX, accesibilidad y confianza

| ID | Categoría | Activo | Riesgo | Causa | P | I | Nivel | Mitigación | Responsable | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-020 | Accesibilidad | Interfaz | Que textos pequeños naranja/blanco no cumplan contraste AA | Paleta institucional en tamaños de 10–11 px | 4 | 2 | Medio (8) | Auditoría de contraste y ajuste de tonos/tamaños | Frontend + UX | Informe de contraste | Abierto |
| R-021 | Accesibilidad | Interfaz | Que el flujo no sea usable con lector de pantalla o en móvil | Sin pruebas con usuarios ni auditoría | 3 | 3 | Medio (9) | Pruebas con lectores y revisión responsive | QA + UX | Checklist WCAG 2.1 AA | Abierto |
| R-022 | UX / Confianza | Vista del estudiante | Que el panel de pruebas se confunda con funcionalidad real | `demo-panel.tsx` integrado en la vista | 3 | 2 | Medio (6) | Ocultar en builds no-demo y etiquetar como simulación | Frontend | Captura del build de producción | Abierto |
| R-023 | UX | Mensajes | Que los mensajes de error no distingan 401/403/404/500 | Tratamiento genérico en algunos flujos | 2 | 2 | Bajo (4) | `error.tsx` y `not-found.tsx` añadidos; falta matriz 401/403 | Frontend | Prueba de render de error | En tratamiento |

### 4.5 Operación, despliegue y continuidad

| ID | Categoría | Activo | Riesgo | Causa | P | I | Nivel | Mitigación | Responsable | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-024 | Operación | Demo | Que la demo falle durante la presentación | Dependencia de un proceso Next vivo | 2 | 4 | Medio (8) | Build local de respaldo, video y capturas | DevOps + Equipo | Ensayo con plan B | Abierto |
| R-025 | Operación | Observabilidad | Que no se detecten fallos en una demo pública | Sin monitoreo, logs ni alertas | 3 | 2 | Medio (6) | Logs básicos y alerta de disponibilidad | DevOps | Panel de disponibilidad | Abierto |

### 4.6 Calidad, mantenibilidad y cadena de suministro

| ID | Categoría | Activo | Riesgo | Causa | P | I | Nivel | Mitigación | Responsable | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-026 | Calidad | Integración futura | Que sustituir el mock por una API real rompa la UI | Imports directos a `mock-api.ts` desde componentes/store | 4 | 3 | Alto (12) | Introducir puerto/adaptador antes de integrar | Frontend | Prueba con doble de API | Abierto |
| R-027 | Calidad | Cobertura | Que errores de integración no se detecten | 67 pruebas sin E2E ni cobertura medida | 3 | 3 | Medio (9) | Añadir E2E y umbral de cobertura | QA | Reporte de cobertura + E2E | Abierto |
| R-028 | Gestión | Documentación | Que la documentación diverja del código y debilite la evidencia | Divergencias README / spec / sprint-review | 3 | 2 | Medio (6) | Revisión cruzada antes de la entrega | Equipo | Checklist de consistencia | Abierto |
| R-029 | Cadena de suministro | Dependencias | Que una dependencia reciente introduzca una vulnerabilidad | Next 16, React 19, Tailwind 4, Vitest 4; sin auditoría | 3 | 3 | Medio (9) | `npm audit` en CI y fijado de versiones | DevOps | Reporte de auditoría | Abierto |
| R-030 | Calidad | Cabeceras | Que falten CSP/HSTS y protección de navegador | `next.config.ts` solo define cabeceras básicas | 3 | 3 | Medio (9) | Añadir CSP y HSTS en el despliegue | DevOps | Escaneo de cabeceras | Abierto |

### 4.7 Gestión, alcance y evidencia académica

| ID | Categoría | Activo | Riesgo | Causa | P | I | Nivel | Mitigación | Responsable | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-031 | Gestión | Expectativas | Que se confunda “prototipo validado” con “sistema listo para operar” | Demo pulida con datos ficticios | 3 | 4 | Alto (12) | Declaración explícita de límites en la revisión y el informe | Producto | Sección “fuera de alcance” presentada | Abierto |
| R-032 | Gestión | Evidencia | Que los extras (`STATUS`, panel, rutas duplicadas) diluyan la evidencia de HU-01..04 | Alcance con extras no exigidos | 2 | 2 | Bajo (4) | Mapear cada extra a una HU o retirarlo de la narrativa | Producto | Matriz extra → HU | Abierto |

---

## 5. Registro B · Riesgos de la puesta en producción

> El Registro B se deriva del Registro A: cada fila declara el control existente
> que se reutiliza y el control nuevo que exige producción.

| ID | Riesgo | Deriva de | Control nuevo requerido | Horizonte | Responsable |
| --- | --- | --- | --- | --- | --- |
| P-001 | Autorización solo en cliente | R-001 | RBAC de servidor + validación de sesión | Antes de piloto | Backend |
| P-002 | Sesión y token no verificados | R-003 | SSO institucional + validación de token | Antes de piloto | Arquitectura |
| P-003 | Datos ajenos en el cliente | R-002 | API con filtro por identidad, sin bundle de datos | Antes de piloto | Backend |
| P-004 | Sin auditoría | R-006 | Log inmutable y retención definida | Antes de piloto | Seguridad |
| P-005 | Archivos sin antivirus ni cuarentena | R-012 | Pipeline de escaneo y cuarentena | Antes de producción | Seguridad |
| P-006 | Sin rate limiting ni protección de enumeración | R-004, R-005 | Límites por usuario/IP y mensajes uniformes | Antes de producción | Backend |
| P-007 | Sin persistencia ni concurrencia controlada | R-018, R-019 | Base de datos y control de versión | Antes de producción | Backend |
| P-008 | Accesibilidad no certificada | R-020, R-021 | Auditoría WCAG 2.1 AA | Antes de producción | UX + QA |
| P-009 | Integración con Aula Virtual sin contrato oficial | Anexo A | API/SSO oficial o proxy en mismo origen | Antes de piloto | Arquitectura + TI |

---

## 6. Mapa de calor

> Ubicar cada ID en la celda `P × I`. Se incluyen los propuestos del Registro A.

| P \ I | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| **5** | | | | | R-003 |
| **4** | | R-004, R-015, R-018, R-020 | R-010, R-014, R-026 | R-006 | R-002 |
| **3** | | R-011, R-022, R-025, R-028 | R-005, R-007, R-013, R-016, R-021, R-027, R-029, R-030 | R-008, R-031 | R-001 |
| **2** | | R-023, R-032 | R-009, R-019 | R-017, R-024 | R-012 |
| **1** | | | | | |

**Lectura rápida:** 4 riesgos críticos, 6 altos, 20 medios y 2 bajos.
La zona crítico/alta concentra los riesgos de seguridad y control de acceso, que
son también los que bloquean el uso con datos reales.

---

## 7. Plan de mitigación por horizonte

### 7.1 Antes de la entrega / Sprint Review (0–3 días)

| Acción | Riesgos | Evidencia de cierre |
| --- | --- | --- |
| Declarar límites del prototipo en el informe y la demo | R-031, R-022 | Sección “fuera de alcance” |
| Marca de agua “DEMO” en la constancia | R-009 | Archivo descargado revisado |
| Aplicar `enmascararDni` | R-011 | Prueba de formato |
| Revisión de contraste y tamaños mínimos | R-020 | Captura + checklist |
| `error.tsx` y `not-found.tsx` | R-023 | Prueba de render |
| Plan B de demo (build local + video) | R-024 | Ensayo |
| Revisión cruzada de documentación | R-028 | Checklist |

### 7.2 Antes de un piloto con datos reales

| Acción | Riesgos | Evidencia de cierre |
| --- | --- | --- |
| Backend con autorización por sesión | R-001, R-008 | E2E 403 |
| SSO y validación de token | R-003 | Prueba de token inválido |
| Eliminar datos ajenos del bundle | R-002 | Inspección del build |
| Auditoría persistente | R-006 | Consulta de log |
| Rate limiting y decisión sobre enumeración | R-004, R-005 | Prueba de límites |
| Persistencia y control de concurrencia | R-018, R-019 | Prueba de recarga y concurrencia |
| Validación completa de subsanación | R-014, R-015 | Prueba de rechazo parcial |

### 7.3 Antes de producción

| Acción | Riesgos | Evidencia de cierre |
| --- | --- | --- |
| Antivirus, cuarentena y retención de archivos | R-012 | Prueba de archivo malicioso |
| WCAG 2.1 AA | R-020, R-021 | Informe de auditoría |
| CSP, HSTS y `npm audit` en CI | R-029, R-030 | Escaneo de cabeceras y reporte |
| Observabilidad y alertas | R-025 | Panel de disponibilidad |
| Integración oficial con Aula Virtual | R-009 / Anexo A | Contrato o proxy aprobado |

---

## 8. Riesgos aceptados

| ID | Riesgo | Justificación | Condición de reapertura | Aprobado por |
| --- | --- | --- | --- | --- |
| R-017 | `?STATUS` permite forzar estados | Solo existe en modo demo; no hay datos reales | Se despliega con datos reales o en dominio público | Equipo de proyecto |
| R-022 | Panel de pruebas visible | Necesario para la Sprint Review | La demo se publica para estudiantes | Equipo de proyecto |
| R-018 | Sin persistencia | Aceptable en prototipo; se declara en la demo | Se espera continuidad entre sesiones | Equipo de proyecto |
| R-004 | 403 exacto revela existencia | Requisito UX de la especificación v2 (criterio 1.2) | Seguridad exige mensaje uniforme | Equipo de proyecto |

---

## 9. Trazabilidad a HU y DoD

| HU / criterio | Riesgos asociados | Evidencia actual |
| --- | --- | --- |
| HU-01 · consulta propia (1.1) | R-001, R-002, R-003 | `mock-api.test.ts`, `seguimiento-app.test.tsx` |
| HU-01 · acceso ajeno (1.2) | R-001, R-004, R-008 | Prueba 403 |
| HU-01 · inexistente (1.3) | R-004 | Prueba 404 |
| HU-01 · falla de servicio (1.4) | R-023, R-025 | Prueba 500 + reintento |
| HU-02 · área y siguiente paso | R-016, R-031 | `timeline.test.ts` |
| HU-03 · documentos observados | R-012, R-014, R-015 | `useSeguimientoStore.test.ts` |
| HU-04 · última actualización | R-016 | `format.test.ts` |
| DoD · aislamiento | R-001, R-002, R-003 | Suite + guion |
| DoD · build limpio | R-027, R-028, R-029, R-030 | `build`, `lint`, `tsc` |

---

## 10. Preguntas abiertas

Heredadas del contexto §15; marcar la decisión cuando se resuelvan.

| # | Pregunta | Decisión | Fecha |
| --- | --- | --- | --- |
| 1 | ¿El análisis evalúa solo el prototipo o también producción? | Ambos registros (A y B) | 19/11/2026 |
| 2 | ¿Se prevé conectar a backend/SSO a corto plazo? | No en esta entrega; previsto en el MVP (§11) | 19/11/2026 |
| 3 | ¿Se usarán datos personales reales en alguna demo? | No; solo datos ficticios | 19/11/2026 |
| 4 | ¿El módulo será público en internet? | No; demo controlada con `robots: noindex` | 19/11/2026 |
| 5 | ¿Se exige auditoría o trazabilidad institucional? | No para el prototipo; obligatoria en producción (P-004) | 19/11/2026 |
| 6 | ¿Se exige WCAG AA? | No formalmente; objetivo de la fase 5 del MVP | 19/11/2026 |
| 7 | ¿Volumen y horario esperados? | Demo académica con un usuario; producción a definir con TI | 19/11/2026 |
| 8 | ¿Quién es el dueño del dato y del trámite? | A confirmar con TI; se asume Registro Académico / Mesa de Partes | 19/11/2026 |
| 9 | ¿Qué ocurre si la sesión expira? | 401 sin reautenticación (R-007) | 19/11/2026 |
| 10 | ¿Se acepta el riesgo de enumeración? | Aceptado con condición (R-004) | 19/11/2026 |

---

## 11. Trabajo futuro · MVP desplegado

La evolución natural del prototipo es un **MVP independiente desplegado** (por
ejemplo en Vercel) que sustituya la capa simulada por servicios reales, sin
intentar acoplarse al Aula Virtual. El objetivo no es "integrarse hoy", sino
dejar preparados los puntos de sustitución para una integración posterior.

### 11.1 Separación por puertos y adaptadores

```text
UI (Next.js) → API /api/v1 → Casos de uso → Puertos
                                             ├── IdentityProvider   (local hoy / SSO UNICA después)
                                             ├── TramitesRepository (Postgres hoy / API UNICA después)
                                             └── DocumentStorage    (Blob hoy / almacenamiento institucional)
```

### 11.2 Qué cierra el MVP del Registro A

| Riesgo | Cómo lo cierra |
| --- | --- |
| R-001 | Autorización en servidor, validada contra la sesión |
| R-002 | Los datos dejan de viajar en el bundle; la API filtra por identidad |
| R-003 | Autenticación real con cookie `HttpOnly` y sesión firmada |
| R-006 | Tabla de auditoría con actor, acción, entidad y fecha |
| R-008 | El cliente no decide autorización ni estado persistido |
| R-018 | Persistencia en base de datos |

### 11.3 Fases

| Fase | Contenido | Esfuerzo |
| --- | --- | --- |
| 0 | Esquema, migraciones, seed ficticio, CI y despliegue base | 2–3 días |
| 1 | Login, sesión firmada, RBAC y middleware | 2–3 días |
| 2 | API de lectura (`/api/v1/tramites`) y UI conectada | 2–3 días |
| 3 | Subida de documentos, asociación a requisitos y auditoría | 3–4 días |
| 4 | Panel administrativo de estados | 2–3 días |
| 5 | E2E, cobertura, CSP/HSTS y accesibilidad básica | 2–3 días |
| 6 | OpenAPI y adaptadores de integración con dobles | 2–3 días |

**Total estimado:** 15–22 días-persona. No forma parte del alcance de esta
entrega y no debe confundirse con el estado actual del prototipo (R-031).

### 11.4 Condiciones de integración con el sistema real

La observación del Anexo A concluye que la reutilización de cookies desde otro
origen no es viable. El MVP debe prever dos modos de integración:

1. **Proxy en el mismo origen**: el dominio institucional sirve el módulo bajo
   una ruta propia y la identidad llega por cabecera firmada.
2. **API consumida por el frontend institucional**: contrato `/api/v1`
   documentado, sin dependencia de la UI de este prototipo.

---

## 12. Anexo A · Factibilidad de integración con el Aula Virtual

> Resumen de una observación no intrusiva de headers públicos/autenticados con
> cuenta propia. **No incluye valores de cookies ni credenciales.**

### 12.1 Hechos observados (19/11/2026)

| Observación | Implicancia |
| --- | --- |
| `server: nginx` + `x-correlation-id` | API .NET detrás de proxy/gateway |
| Cookies `.AspNetCore.Cookies=C1+C2` (chunking) | ASP.NET Core Identity con ticket fragmentado |
| Cookie `.AspNetCore.Antiforgery.*` | Antiforgery de ASP.NET Core |
| `sec-fetch-site: same-origin` | SPA y API en el mismo origen |
| Sin `access-control-allow-origin` | Sin CORS configurado |
| Endpoint JSON `.../web/user/info/system/courseinrole` | API privada sin contrato público |

### 12.2 Conclusión

La reutilización de cookies desde un origen distinto **no es viable** (sin CORS,
cookies host-only por defecto y `SameSite` restrictivo). Las únicas vías son:

1. Despliegue en el **mismo origen** detrás del proxy institucional.
2. **SSO/API oficial** acordada con TI.

Se descarta para el prototipo y se registra como riesgo P-009.

### 12.3 Pendiente

Pendiente de respuesta de TI: contrato de API, alcance de datos y condiciones de
uso. Sin esa respuesta, la integración se mantiene como escenario futuro (§11.4)
y no como dependencia del prototipo.

---

## 13. Anexo B · Evidencia de verificación

```text
Test Files  6 passed (6)
Tests       67 passed (67)
```

| Comando | Resultado | Fecha |
| --- | --- | --- |
| `npm test` | 67/67 | 19/11/2026 |
| `npm run lint` | Sin errores | 19/11/2026 |
| `npx tsc --noEmit` | Sin errores | 19/11/2026 |
| `npm run build` | Compilación correcta · 8 rutas, incluida `/_not-found` | 19/11/2026 |

---

## 14. Registro de cambios

| Versión | Fecha | Cambio | Autor |
| --- | --- | --- | --- |
| 0.1 | 19/11/2026 | Esqueleto inicial con riesgos candidatos y valoración propuesta | Equipo |
| 0.2 | 19/11/2026 | Resumen ejecutivo, trabajo futuro, evidencias de build y mitigaciones R-009/R-023 | Equipo |
