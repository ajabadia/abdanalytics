# 🗺️ Hoja de Ruta de Analíticas - ABDAnalytics (ABDBoard)

Este documento detalla la planificación estratégica, las fases del ecosistema y los próximos hitos a desarrollar en la consola centralizada de analíticas unificadas.

---

## 🏁 Estado de Hitos del Roadmap

### 🟩 Completado (Completed)
- **Fase 1: Configuración del Cascarón y SSO**
  - Clonación base de logs y re-configuración del puerto `3700`.
  - Registro de federación de clientes y políticas de licenciamiento para todos los tenants en `ABDAuth`.
  - Adaptación de `@abd/styles` y layout superior `SmartNavbar`.

### 🟨 En Curso (Active Development)
- **Fase 2: Conexión de Modelos y Datos de Solo Lectura**
  - Creación de esquemas Mongoose `UserCourseSummary` y `CourseAnalytics`.
  - Conexión dinámica multi-tenant mediante pools de solo lectura.

### 🟦 Próximamente (Future Roadmap)
- **Fase 3: Visualización del Dashboard del Administrador**
  - Implementación de la vista de 4 pestañas: Resumen de la Suite, LMS (ABDQuiz), Seguridad (ABDAuth) y Gobernanza (ABDtenantGobernance).
  - Integración de gráficos `recharts` para histogramas Gauss y curvas de aprendizaje.
- **Fase 4: Firma Criptográfica de PDFs y QR**
  - Generación asíncrona de reportes PDF.
  - Integración del validador público enlazando hashes contra los logs inmutables de `ABDLogs`.
