# Convergia

**Simulador determinista de decisiones multi-stakeholder para entornos industriales**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Elevator Pitch

> **Convergia** simula cómo múltiples decisores con intereses contrapuestos alcanzan (o no) un consenso en una decisión de inversión industrial — sin inteligencia artificial, sin azar, solo lógica determinista verificable.

> 📋 **¿Quieres presentar Convergia?** Consulta [`DEMO.md`](./DEMO.md) — guías de presentación de 2–3 y 5 minutos con scripts completos y tips.

---

## El problema que resuelve

En cualquier organización industrial, las decisiones estratégicas no las toma una sola persona. Intervienen producción, calidad, finanzas, sostenibilidad... cada uno con sus propias prioridades, líneas rojas y umbrales de aceptación.

**¿Cómo se modela ese proceso de negociación de forma rigurosa?**

La mayoría de herramientas de toma de decisiones asumen un decisor único o tratan el conflicto como ruido. Convergia lo convierte en el objeto central del análisis.

---

## Propuesta de valor

| Característica | Descripción |
|---|---|
| 🎯 **Motor determinista** | Mismo input → mismo output. Sin azar, sin LLM, sin caja negra. |
| 👥 **Multi-stakeholder real** | 4 decisores con pesos, prioridades y líneas rojas independientes. |
| ⚡ **Negociación por rondas** | Scoring, conflictos, concesiones y convergencia explícita. |
| 📊 **Explicabilidad total** | Cada número, cada decisión, cada concesión tiene una causa rastreable. |
| 🔍 **Verificación técnica** | Página `/debug` con acceso completo a todos los datos internos del motor. |
| 🏗️ **Caso industrial realista** | MetalWorks S.A.: 5 opciones de inversión, 6 variables, restricciones reales. |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16** (App Router, React 19) |
| Lenguaje | **TypeScript** (modo estricto) |
| Estilos | **Tailwind CSS v4** |
| Motor de simulación | **TypeScript puro** — sin dependencias externas |
| Bundler | **Turbopack** |
| Despliegue | Preparado para **Vercel** / cualquier hosting estático |

---

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                  │
│         Next.js App Router · React 19 · Tailwind        │
│                                                         │
│  /             Landing + demo flow                      │
│  /scenario     Contexto industrial + opciones           │
│  /stakeholders Perfiles de decisores + pesos            │
│  /debate       Rondas de negociación interactivas       │
│  /result       Decisión final + narrativa explicativa    │
│  /debug        Verificación técnica completa            │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │  datos calculados
                        │
┌───────────────────────▼─────────────────────────────────┐
│                 MOTOR DETERMINISTA                       │
│              TypeScript puro · Sin estado                │
│                                                         │
│  scoring.ts     → Cálculo de scores ponderados          │
│  veto.ts        → Detección de líneas rojas + vetos     │
│  conflict.ts    → Matriz de conflicto entre stakeholders│
│  consensus.ts   → Indicador de consenso + aceptabilidad │
│  concession.ts  → Mecánica de concesiones               │
│  simulation.ts  → Orquestador principal (runSimulation)  │
│  narrative.ts   → Generador de narrativa determinista   │
│  types.ts       → Sistema de tipos compartido           │
└─────────────────────────────────────────────────────────┘
```

### Dualidad clave: Motor vs. Presentación

**Motor determinista** (`src/engine/`):
- Recibe datos de entrada (escenario, stakeholders, opciones).
- Ejecuta N rondas de simulación con scoring, vetos, conflictos y concesiones.
- Produce un `SimulationResult` completo: scores, rankings, concesiones, consenso.
- **Es una función pura**: mismos datos de entrada producen siempre el mismo resultado.
- No tiene efectos secundarios, no llama APIs externas, no usa aleatoriedad.

**Capa de presentación** (`src/app/`, `src/components/`):
- Consume los datos ya calculados del motor.
- Genera narrativas explicativas a partir de los números (`narrative.ts`).
- Presenta el flujo como un walkthrough guiado en 4 pasos.
- **Toda explicación es derivada**, no inventada: cada texto se construye a partir de datos reales.

---

## Flujo de la aplicación

```
Inicio → Escenario → Stakeholders → Debate → Resultado
  │          │              │            │          │
  │     Contexto de    Perfiles de   Rondas de   Decisión
  │     MetalWorks,    4 decisores,  negociación  final +
  │     KPIs, 5        pesos,        con scoring, narrativa
  │     opciones de    líneas rojas  conflictos,  explicativa
  │     inversión                    concesiones  completa
  │
  └─── /debug: verificación técnica con todos los datos internos
```

---

## Ejecutar el proyecto

```bash
# Clonar el repositorio
git clone https://github.com/markusx5622/Convergia.git
cd Convergia

# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
npm start
```

La aplicación se abrirá en `http://localhost:3000`.

---

## Capturas de pantalla

> 📸 *Sección preparada para screenshots del flujo completo. Para añadir capturas, guarda las imágenes en `public/screenshots/` y reemplaza los placeholders de abajo.*

### Preview visual

| Pantalla | Ruta | Descripción |
|---|---|---|
| **Landing** | `/` | Hero + propuesta de valor + flujo de demo |
| **Escenario** | `/scenario` | Contexto industrial, KPIs, opciones de inversión |
| **Stakeholders** | `/stakeholders` | Perfiles, pesos, comparativa, parámetros de negociación |
| **Debate** | `/debate` | Rondas interactivas con narrativa, scoring, conflictos |
| **Resultado** | `/result` | Opción ganadora, narrativa explicativa, desglose por stakeholder |
| **Debug** | `/debug` | Tablas completas de verificación del motor |

```
<!-- Cuando añadas capturas, usa esta estructura:

![Landing — Hero y propuesta de valor](public/screenshots/landing.png)
![Escenario — MetalWorks S.A.](public/screenshots/scenario.png)
![Stakeholders — Comparativa de pesos](public/screenshots/stakeholders.png)
![Debate — Rondas de negociación](public/screenshots/debate.png)
![Resultado — Decisión final y narrativa](public/screenshots/result.png)
![Debug — Verificación técnica](public/screenshots/debug.png)

-->
```

### Demo highlights

- **Paso 1 (Escenario):** empresa MetalWorks S.A., 450 000 €, 5 opciones de inversión, 6 variables.
- **Paso 2 (Stakeholders):** 4 decisores con pesos asimétricos, líneas rojas y umbrales de negociación distintos.
- **Paso 3 (Debate):** 3 rondas de scoring → detección de vetos → concesiones iterativas → convergencia.
- **Paso 4 (Resultado):** decisión consensuada con narrativa explicativa derivada de datos + desglose por stakeholder.
- **Extra (/debug):** estado interno completo del motor — scores, rankings, matriz de conflicto, concesiones, todo.

---

## Cómo hacer la demo

> Versión corta. Para scripts detallados con timings exactos, ver [`DEMO.md`](./DEMO.md).

### Ruta recomendada (3 minutos)

```
/ → /scenario → /stakeholders → /debate → /result → /debug (opcional)
```

| Pantalla | Duración | Qué mostrar |
|---|---|---|
| `/` Landing | 30 s | Elevator pitch + destacar los 3 highlights (Determinista · Multi-stakeholder · Explicable) |
| `/scenario` | 30 s | Empresa, presupuesto, 2–3 opciones contrastantes |
| `/stakeholders` | 45 s | Tabla de pesos comparativa + una línea roja como ejemplo |
| `/debate` | 45 s | Panel resumen (ganador inicial vs. final) + pestaña de ronda 1 y ronda 3 |
| `/result` | 30 s | Decisión final + narrativa + estado de consenso |
| `/debug` | opcional | Prueba de que todo es reproducible y auditable |

---

## Qué destacar

Estas son las cinco propiedades que diferencian Convergia de un análisis de decisión convencional:

1. **Determinismo verificable** — Mismo input → mismo output, sin excepciones. Recarga la página: el resultado es idéntico.

2. **Conflicto como objeto de estudio** — El conflicto entre stakeholders no se elimina ni se promedia. Se mide, se modela y se gestiona explícitamente a través de concesiones.

3. **Narrativa derivada de datos** — Cada frase de la explicación tiene una causa en los datos calculados. No hay texto inventado ni generado por IA.

4. **Auditabilidad total** — Cualquier afirmación del sistema puede rastrearse hasta su origen en el motor. La página `/debug` lo demuestra.

5. **Separación limpia motor / presentación** — `src/engine/` es una librería pura sin dependencias de UI. `src/app/` solo consume sus outputs. Este desacoplamiento permite extender ambas capas de forma independiente.

---

## Por qué este proyecto es diferente

| Enfoque habitual | Convergia |
|---|---|
| Un decisor único o un comité abstracto | 4 decisores con perfiles, pesos y restricciones distintas |
| Promedios y rankings estáticos | Rondas iterativas con concesiones que modifican el resultado |
| Caja negra o IA generativa | Motor determinista con lógica explícita y auditable |
| El consenso como estado binario | El consenso como indicador graduado (full / partial / tie / none) |
| Explicación narrativa generada | Narrativa derivada matemáticamente de los datos del motor |

**La pregunta central de Convergia no es "¿qué opción tiene mejor score?" sino "¿cómo llegan actores con intereses opuestos a estar de acuerdo —o no— sobre esa opción?"**

---

## Relevancia académica

### Ingeniería en Organización Industrial

1. **Toma de decisiones multi-criterio (MCDM)**: Aplica conceptos de MCDM con stakeholders reales, no abstractos. La matriz de pesos es un AHP simplificado con restricciones de negociación.

2. **Gestión del conflicto organizacional**: Modela explícitamente el conflicto entre departamentos — algo que se estudia en teoría pero rara vez se simula de forma rigurosa.

3. **Transparencia del proceso decisional**: Cada paso es auditable. No hay "caja negra". Esto es esencial en entornos industriales regulados donde las decisiones deben poder justificarse ante auditores o reguladores.

4. **Caso industrial realista**: MetalWorks S.A. es un caso verosímil con restricciones reales (presupuesto, KPIs, líneas rojas, riesgo de implementación).

5. **Puente entre ingeniería y gestión**: Demuestra competencias técnicas (TypeScript estricto, arquitectura de software, diseño de algoritmos) y de dominio (gestión industrial, negociación, toma de decisiones bajo conflicto).

6. **Reproducibilidad**: El motor determinista garantiza que cualquier evaluador puede ejecutar la demo y obtener exactamente el mismo resultado — requisito fundamental para evaluación académica.

### Ingeniería de Software / Informática

1. **Arquitectura limpia**: Separación clara entre lógica de dominio (`src/engine/`) y capa de presentación (`src/app/`). El motor es una función pura sin efectos secundarios.

2. **TypeScript estricto**: Sistema de tipos completo con interfaces bien definidas. `SimulationResult`, `RoundResult`, `Stakeholder`, `InvestmentOption` son tipos explícitos y verificados.

3. **Next.js App Router**: Uso correcto de Server Components, Client Components y layout global con Tailwind v4.

4. **Diseño de algoritmos**: El motor implementa scoring ponderado, detección de vetos, cálculo de matriz de conflicto, indicadores de consenso y mecánica de concesiones iterativas.

---

## Roadmap futuro

### v1 — Estado actual ✅

El sistema incluye:

- Motor determinista completo (scoring, vetos, conflicto, consenso, concesiones)
- UI walkthrough de 4 pasos + página de verificación técnica `/debug`
- Narrativa explicativa derivada de datos
- Escenario industrial realista: MetalWorks S.A.
- Despliegue listo para Vercel / cualquier hosting estático

### v2 — Extensiones razonables

| Feature | Complejidad | Valor |
|---|---|---|
| **Múltiples escenarios** | Baja — el motor ya soporta cualquier input | Permite comparar decisiones en diferentes contextos |
| **Modo interactivo** | Media — ajustar pesos desde la UI y re-ejecutar | Ideal para talleres y exploración pedagógica |
| **Exportación PDF** | Baja — render del `SimulationResult` a PDF | Informe ejecutivo descargable para uso real |
| **Análisis de sensibilidad** | Media — variar un parámetro y ver el impacto | Herramienta de exploración para formación |
| **Tests automatizados** | Baja — el motor es una función pura, muy testeable | Garantía de calidad para uso en producción |

### v3 — Integraciones avanzadas

- [ ] **Integración LLM** — Narrativas más ricas generadas por modelo de lenguaje, como capa complementaria (no como reemplazo del motor determinista)
- [ ] **Comparación de escenarios** — Side-by-side de diferentes configuraciones
- [ ] **Persistencia** — Base de datos para guardar y compartir simulaciones
- [ ] **Autenticación** — Login para gestionar escenarios propios

---

## Limitaciones actuales y decisiones de diseño

### Limitaciones funcionales

| Limitación | Detalle |
|---|---|
| **Escenario único** | Solo incluye el caso MetalWorks S.A. con datos fijos. La arquitectura soporta múltiples escenarios; es una extensión directa. |
| **Sin personalización desde UI** | Los stakeholders y opciones no son editables desde la interfaz. Los datos viven en `src/data/` y son fácilmente modificables en el código. |
| **Sin persistencia** | Los resultados no se guardan entre sesiones. Cada carga re-ejecuta el motor (operación de milisegundos). |
| **Sin tests automatizados** | El motor no tiene suite de tests formales, aunque su naturaleza determinista facilita enormemente añadirlos. |
| **Sin responsive completo** | Optimizado para desktop; funciona en móvil pero las tablas de datos no están pulidas para pantallas pequeñas. |

### Por qué no hay LLM (y por qué eso es una decisión de rigor)

La ausencia de integración con un modelo de lenguaje no es una carencia técnica — es una elección deliberada:

> **Problema con LLMs en sistemas de decisión:** un LLM puede generar una explicación que suene plausible pero sea incorrecta respecto a los datos reales. En un entorno donde la explicabilidad y la trazabilidad son requisitos (entornos industriales regulados, evaluación académica), ese riesgo es inaceptable.

> **La solución de Convergia:** toda narrativa es una función determinista de los datos calculados. Cada frase tiene una causa rastreable en el motor. Esto garantiza que la explicación sea siempre correcta respecto al resultado.

La integración LLM está planificada para v3 como capa complementaria, no como reemplazo del motor determinista. La secuencia correcta es: primero rigor, después fluidez narrativa. Convergia ya tiene el rigor.

---

## Estructura del proyecto

```
src/
├── app/                  # Páginas (Next.js App Router)
│   ├── page.tsx          # Landing / home
│   ├── layout.tsx        # Layout global
│   ├── globals.css       # Estilos globales
│   ├── scenario/         # Paso 1: Escenario
│   ├── stakeholders/     # Paso 2: Stakeholders
│   ├── debate/           # Paso 3: Debate
│   ├── result/           # Paso 4: Resultado
│   └── debug/            # Verificación técnica
├── components/           # Componentes React reutilizables
├── data/                 # Datos del escenario demo
│   ├── scenario.ts       # MetalWorks S.A.
│   ├── stakeholders.ts   # 4 decisores
│   └── options.ts        # 5 opciones de inversión
├── engine/               # Motor determinista
│   ├── simulation.ts     # Orquestador principal
│   ├── scoring.ts        # Cálculo de scores
│   ├── veto.ts           # Sistema de vetos
│   ├── conflict.ts       # Matriz de conflicto
│   ├── consensus.ts      # Indicador de consenso
│   ├── concession.ts     # Mecánica de concesiones
│   ├── narrative.ts      # Narrativa determinista
│   └── types.ts          # Tipos compartidos
├── lib/                  # Utilidades
└── services/             # (Reservado para futuras integraciones)
```

---

## Licencia

MIT

---

<p align="center">
  <strong>Convergia</strong> · Motor determinista de negociación multi-stakeholder<br/>
  Proyecto académico · Ingeniería en Organización Industrial
</p>