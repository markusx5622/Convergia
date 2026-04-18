# Convergia — Demo Script

> Guía de presentación para demos universitarias, entrevistas y uso como portfolio.

---

## Índice

- [Demo de 2–3 minutos](#demo-de-23-minutos) — Pitch rápido para pasillo o introducción
- [Demo de 5 minutos](#demo-de-5-minutos) — Walkthrough completo con contexto técnico
- [Mensajes clave](#mensajes-clave) — Qué transmitir en cada momento
- [Preguntas frecuentes](#preguntas-frecuentes) — Cómo responder las preguntas habituales
- [Notas de presentación](#notas-de-presentación) — Consejos prácticos

---

## Demo de 2–3 minutos

*Ideal para: pasillo, introducción rápida, primer contacto con un profesor.*

### [00:00–00:30] Landing · El problema

**Abre `http://localhost:3000`** (o el despliegue en Vercel).

> "Convergia simula cómo múltiples decisores con intereses opuestos llegan —o no— a un consenso sobre una decisión de inversión industrial. Sin IA, sin azar: lógica determinista pura."

- Señala los tres highlights: **Determinista · Multi-stakeholder · Explicable**
- Señala el bloque de arquitectura al final: motor vs. capa de presentación
- **Mensaje clave:** *"El problema no es la decisión en sí — es cómo modelar el conflicto entre quienes deciden."*

---

### [00:30–01:00] /scenario · El contexto

**Haz clic en "Escenario"** o en la tarjeta del Paso 1.

> "MetalWorks S.A. tiene 450.000 € de presupuesto y debe elegir entre 5 opciones de inversión que impactan 6 variables: productividad, calidad, coste, sostenibilidad, riesgo, tiempo."

- Señala las tarjetas de opciones. No hace falta leerlas todas: con mostrar 2 o 3 basta.
- **Mensaje clave:** *"Este es el input del motor. Datos fijos, escenario industrial realista."*

---

### [01:00–01:30] /stakeholders · Los decisores

**Haz clic en "Stakeholders"** o el botón "Ver stakeholders".

> "Hay 4 decisores: Director de Producción, Directora de Calidad, Director Financiero y Responsable de Sostenibilidad. Cada uno tiene pesos distintos, líneas rojas y umbrales de negociación."

- Muestra la tabla de pesos comparativa: *"Producción le da un 40% al impacto en productividad; Finanzas le da un 45% a la reducción de costes."*
- Señala la fila de "Líneas rojas": *"Estas son restricciones no negociables. Si una opción las viola, ese stakeholder la veta."*
- **Mensaje clave:** *"Estas asimetrías son las que generan el conflicto. Sin ellas, la decisión sería trivial."*

---

### [01:30–02:15] /debate · El motor en acción

**Haz clic en "Debate"**.

> "Aquí el motor ejecuta las rondas de negociación. Primero calcula scores ponderados, detecta vetos, construye la matriz de conflicto y ejecuta concesiones."

- Muestra el panel resumen (ganador inicial, ganador final, número de rondas y concesiones).
- Si el ganador cambió entre rondas, señálalo: *"El ganador de la Ronda 1 no es el mismo que el final — las concesiones alteraron los pesos y eso cambió el resultado."*
- Haz clic en las pestañas de ronda para mostrar cómo evolucionan los scores.
- **Mensaje clave:** *"Todo esto es determinista: si recargas la página, el resultado es exactamente el mismo."*

---

### [02:15–02:45] /result · La decisión final

**Haz clic en "Ver resultado final"**.

> "Esta es la decisión consensuada. La narrativa explica por qué ganó esta opción, quién la apoya y qué variables fueron determinantes. No hay texto inventado: cada frase se genera a partir de los datos calculados."

- Señala el estado de consenso (full / partial).
- Señala el desglose por stakeholder.
- **Mensaje clave:** *"Toda la explicación es derivada de los datos, no generada por IA. Eso es lo que la hace verificable."*

---

### [02:45–03:00] Cierre

> "Si quieres verificar cada número internamente, hay una página /debug que muestra el estado completo del motor: scores, rankings, matriz de conflicto, concesiones, todo."

- Si hay tiempo, abre `/debug` y señala la tabla de scores.

---

## Demo de 5 minutos

*Ideal para: defensa de proyecto, entrevista técnica, presentación en clase.*

### [00:00–00:45] Landing · El problema y la arquitectura

**Abre `http://localhost:3000`**.

> "Convergia responde una pregunta concreta de Ingeniería en Organización Industrial: ¿cómo se modela el proceso por el que múltiples decisores con intereses contrapuestos alcanzan —o no— un consenso? La respuesta habitual es simplificarlo. Convergia lo convierte en el objeto central."

- Lee el subtítulo en voz alta: *"Simulador de decisiones multi-stakeholder para entornos industriales."*
- Señala los tres highlights y explícalos brevemente.
- Baja hasta el bloque de arquitectura: *"El núcleo es un motor determinista escrito en TypeScript puro. La capa de presentación solo traduce los números en narrativa. Toda explicación es derivada, no inventada."*
- **Mensaje clave:** *"Determinismo y explicabilidad son elecciones de diseño, no limitaciones. Es rigor metodológico."*

---

### [00:45–01:30] /scenario · El escenario industrial

**Navega a `/scenario`**.

> "El escenario es MetalWorks S.A.: empresa de fabricación metálica con 250 empleados, 450.000 € de presupuesto y un problema de modernización de planta. Tiene que elegir entre 5 opciones de inversión."

- Describe brevemente las opciones (no todas, selecciona 2 contrastantes, por ejemplo la más cara y la más barata).
- Señala los KPIs actuales: *"Estos son los valores de partida que las opciones intentan mejorar."*
- Señala que cada opción impacta 6 variables: productividad, calidad, coste, sostenibilidad, riesgo de implementación, tiempo de adopción.
- **Insight clave:** *"El escenario es fijo porque la demostración tiene que ser reproducible. Cualquier persona que ejecute esto obtiene exactamente el mismo resultado — eso es fundamental para evaluación académica."*

---

### [01:30–02:30] /stakeholders · Perfiles y conflicto latente

**Navega a `/stakeholders`**.

> "Hay 4 decisores, cada uno con una visión diferente del problema. El Director de Producción prioriza velocidad y productividad. La Directora de Calidad exige cero defectos. El Director Financiero maximiza ROI. La Responsable de Sostenibilidad necesita reducir emisiones."

- Abre una tarjeta de stakeholder y señala los campos: pesos, líneas rojas, umbral de concesión, tasa de concesión.
- Muestra la tabla comparativa de pesos: *"Fíjate en cómo Producción y Finanzas tienen distribuciones completamente distintas. Esa asimetría es la que genera el conflicto."*
- Señala la fila de líneas rojas y explica: *"Una línea roja es una restricción no negociable. Si una opción viola la condición de un stakeholder, ese stakeholder la veta. Dos vetos eliminan la opción por completo."*
- Señala la tabla de parámetros de negociación: umbral de concesión y tasa de concesión.
- **Insight técnico:** *"El motor no asume que todos los decisores son racionales en el mismo sentido. Cada uno tiene sus propias reglas. Eso es lo que hace el modelo no trivial."*

---

### [02:30–03:30] /debate · El motor en acción

**Navega a `/debate`**.

> "Aquí es donde ocurre todo. El motor ejecuta 3 fases: scoring ponderado, detección de vetos y conflicto, y concesiones iterativas."

**Explica las tres fases:**

1. **Scoring:** *"Para cada opción, el motor calcula el score de cada stakeholder multiplicando el valor de cada variable por su peso. El score global es la media de todos los stakeholders."*

2. **Vetos:** *"Antes de calcular rankings, el motor verifica líneas rojas. Si una opción viola una línea roja, el stakeholder la veta. Con 2 o más vetos, la opción queda eliminada del proceso."*

3. **Concesiones:** *"El motor detecta stakeholders cuyo preferido está lejos del líder global. Si la diferencia supera su umbral de concesión, ese stakeholder reduce el peso de su variable más crítica — y el proceso vuelve a calcular scores con los pesos ajustados."*

- Muestra el panel resumen: rondas totales, concesiones, si el ganador cambió o no.
- Navega entre pestañas de rondas para mostrar la evolución.
- Señala la narrativa de ronda: *"Esta narrativa no viene de un LLM. Se genera a partir de los datos: quién tiene el score más alto, cuánto conflicto hay, qué concesiones ocurrieron."*
- **Insight clave:** *"El proceso de concesiones es lo que diferencia Convergia de un simple ranking ponderado. Convergia modela el dinamismo de la negociación, no solo el estado inicial."*

---

### [03:30–04:30] /result · Resultado y narrativa explicativa

**Navega a `/result`**.

> "Este es el resultado final del proceso. La opción ganadora es aquella con mayor score global tras completar todas las rondas."

- Lee el título del ganador y el estado de consenso.
- Explica el estado de consenso: *"'Consenso total' significa que todos los stakeholders consideran aceptable la opción ganadora. 'Consenso parcial' significa que la mayoría sí, pero alguno no. El motor distingue estos casos explícitamente."*
- Señala la narrativa explicativa: *"Cada frase de esta explicación tiene una causa en los datos: quién cedió, qué variable fue determinante, por qué la segunda opción quedó descartada."*
- Señala el desglose por stakeholder y abre el detalle de alguno.
- **Mensaje final:** *"Todo esto es auditable. No hay caja negra. Cualquier número de esta pantalla puede rastrearse hasta su origen en el motor."*

---

### [04:30–05:00] /debug y cierre

**Abre `/debug`**.

> "Esta página muestra el estado interno completo del motor: todos los scores, rankings individuales, la matriz de conflicto, las concesiones ronda a ronda y el resultado final. Es la prueba de que todo es determinista y verificable."

- Señala la tabla de scores y explica los colores (azul = preferencia del stakeholder, amarillo = ganador global).
- Señala la matriz de conflicto y explica brevemente: *"Un valor alto entre dos stakeholders significa que tienen preferencias muy diferentes. Es una medida de disonancia del sistema."*
- **Cierre:** *"Convergia no usa IA, no tiene base de datos, no requiere autenticación. Es una función pura que, dados los mismos datos, produce siempre el mismo resultado. Eso lo hace ideal para demostración académica y para empezar a construir sobre él."*

---

## Mensajes clave

| Momento | Qué transmitir |
|---|---|
| Introducción | El problema es el conflicto entre decisores, no la decisión en sí |
| /scenario | Escenario industrial realista y reproducible |
| /stakeholders | Las asimetrías en los pesos son la fuente del conflicto |
| /debate (scoring) | El score no es solo un ranking — es un modelo de preferencia ponderado |
| /debate (vetos) | Las líneas rojas son restricciones duras, no preferencias suaves |
| /debate (concesiones) | Las concesiones modelan el dinamismo real de la negociación |
| /result | Toda explicación es derivada de datos, no generada por IA |
| /debug | Transparencia total: cada número tiene un origen rastreable |
| Cierre | Determinismo = rigor. La ausencia de LLM es una elección, no una carencia |

---

## Por qué no hay LLM (y por qué eso es un punto fuerte)

Esta pregunta aparecerá. La respuesta:

> "Integrar un LLM hubiera sido trivial —añadir una llamada a la API de OpenAI. Pero eso hubiera destruido la propiedad más valiosa del sistema: la verificabilidad. Un LLM puede generar una explicación plausible pero incorrecta. El motor determinista genera una explicación exacta porque es una función de los datos. En un entorno industrial regulado, eso no es un detalle técnico — es un requisito."

Puntos de apoyo:
- El motor es una **función pura**: mismo input → mismo output, siempre.
- Las narrativas son **derivadas**, no generadas: cada frase tiene una causa en los datos.
- Un evaluador puede **verificar** cualquier afirmación del sistema contra los datos del motor.
- La integración LLM es una extensión futura planificada, no descartada — pero añadir rigor antes de añadir fluidez narrativa es la secuencia correcta.

---

## Preguntas frecuentes

**"¿Por qué solo un escenario?"**
> "El escenario único es una decisión deliberada para la versión demo. Garantiza reproducibilidad total y permite centrarse en la lógica del motor sin distracciones. Una v2 con selector de escenarios es una extensión directa."

**"¿Se pueden editar los stakeholders o las opciones?"**
> "En la versión actual, no desde la UI. Los datos viven en src/data/ y son fácilmente modificables en el código. El diseño del motor no asume nada hardcoded — está preparado para recibir cualquier escenario a través de su interfaz de tipos."

**"¿Qué pasaría si no hubiera consenso?"**
> "El motor lo gestiona. Si después de N rondas no hay consenso, el sistema devuelve el estado 'none' o 'tie' con la opción de mayor score global, pero indicando explícitamente que no se alcanzó consenso. La ausencia de consenso es información valiosa, no un error."

**"¿Es escalable a más stakeholders u opciones?"**
> "Sí. Los algoritmos del motor son O(S×O) donde S es el número de stakeholders y O el de opciones. Para uso industrial real con 10-15 stakeholders y 20 opciones el rendimiento sería perfectamente aceptable."

**"¿Cuánto tiempo llevó construirlo?"**
> "El motor determinista es el núcleo más complejo — cubre scoring, vetos, conflicto, consenso y concesiones en TypeScript estricto. La capa de presentación es Next.js 16 con App Router. El conjunto representa un sistema completo y coherente, no una prueba de concepto."

---

## Notas de presentación

- **Antes de la demo:** ejecuta `npm run dev` y abre `http://localhost:3000` en el navegador. La primera carga puede ser ligeramente más lenta por la compilación inicial de Turbopack.
- **Velocidad de la demo:** el motor se ejecuta en el servidor / cliente sin llamadas externas, así que no hay latencia de API que pueda arruinar la presentación.
- **Si algo falla:** la demo funciona también con el despliegue en Vercel. Ten la URL de respaldo preparada.
- **Para presentar el código:** la estructura más impresionante es `src/engine/` — especialmente `simulation.ts` (orquestador) y `scoring.ts` (modelo matemático).
- **Ruta de impacto visual:** Landing → Debate (rondas) → Result (narrativa) → Debug (prueba técnica). Es el recorrido que mejor equilibra contexto, proceso y verificación.
- **Para una defensa técnica:** prepárate para explicar la función `runSimulation()`, el tipo `SimulationResult` y la mecánica de concesiones en `concession.ts`.
