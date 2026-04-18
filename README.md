# Convergia

**Simulador determinista de decisiones multi-stakeholder para entornos industriales**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Elevator Pitch

> **Convergia** simula cómo múltiples decisores con intereses contrapuestos alcanzan (o no) un consenso en una decisión de inversión industrial — sin inteligencia artificial, sin azar, solo lógica determinista verificable.

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

> 📸 *Sección preparada para screenshots del flujo completo.*

| Pantalla | Descripción |
|---|---|
| Landing | Hero + propuesta de valor + flujo de demo |
| Escenario | Contexto industrial, KPIs, opciones de inversión |
| Stakeholders | Perfiles, pesos, comparativa, parámetros de negociación |
| Debate | Rondas interactivas con narrativa, scoring, conflictos |
| Resultado | Opción ganadora, narrativa explicativa, desglose por stakeholder |
| Debug | Tablas completas de verificación del motor |

---

## Roadmap futuro

- [ ] **Integración LLM** — Narrativas generadas por modelo de lenguaje para explicaciones más ricas
- [ ] **Múltiples escenarios** — Selector de escenarios industriales diferentes
- [ ] **Modo interactivo** — Permitir al usuario ajustar pesos y ver el impacto en tiempo real
- [ ] **Exportación PDF** — Informe ejecutivo descargable con el resultado completo
- [ ] **Comparación de escenarios** — Side-by-side de diferentes configuraciones
- [ ] **Persistencia** — Base de datos para guardar simulaciones y compartirlas
- [ ] **Autenticación** — Login para gestionar escenarios propios
- [ ] **Análisis de sensibilidad** — Explorar cómo cambios en los pesos alteran el resultado

---

## Limitaciones actuales

| Limitación | Detalle |
|---|---|
| **Escenario único** | Solo incluye el caso MetalWorks S.A. con datos fijos. |
| **Sin personalización** | Los stakeholders y opciones no son editables desde la UI. |
| **Sin persistencia** | Los resultados no se guardan entre sesiones. |
| **Narrativa determinista** | Las explicaciones son formulaicas, no generadas por IA. |
| **Sin tests automatizados** | El motor no tiene suite de tests (pendiente). |
| **Sin responsive completo** | Optimizado para desktop; funciona en móvil pero no está pulido. |

---

## ¿Por qué este proyecto es interesante para Ingeniería en Organización Industrial?

1. **Toma de decisiones multi-criterio**: Aplica conceptos de MCDM (Multi-Criteria Decision Making) con stakeholders reales, no abstractos.

2. **Gestión del conflicto organizacional**: Modela explícitamente el conflicto entre departamentos — algo que se estudia en teoría pero rara vez se simula.

3. **Transparencia del proceso decisional**: Cada paso es auditable. No hay "caja negra". Esto es esencial en entornos industriales regulados.

4. **Caso industrial realista**: MetalWorks S.A. es un caso verosímil con restricciones reales (presupuesto, KPIs, líneas rojas, riesgo de implementación).

5. **Puente entre ingeniería y gestión**: Demuestra competencias tanto técnicas (TypeScript, arquitectura de software) como de dominio (gestión industrial, negociación, toma de decisiones).

6. **Reproducibilidad**: El motor determinista garantiza que cualquier profesor puede ejecutar la demo y obtener exactamente el mismo resultado — ideal para evaluación académica.

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