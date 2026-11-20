---
name: lf-analyze
description: "Úsala ante un requerimiento nuevo (funcionalidad o cambio con impacto funcional) o un defecto ya diagnosticado cuya corrección no es obvia, antes de cambiar código. Entiende el punto focal y dónde más vive la regla, y define la mejor solución para este sistema: la que resuelve, arriesga lo mínimo, encaja con el código vecino y no deja la zona peor. Soporta iteraciones y cuestionamientos sin perder lo acordado. No la uses para cambios pequeños ya definidos (lf-change)."
---

# lf-analyze

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. En particular:

- Es una conversación, no dos etapas con aprobación. No numeres
  versiones ni presentes "definición funcional" y "definición técnica"
  como formularios.
- Lo que el desarrollador necesita saber del negocio y del punto focal
  se cuenta como el proceso, sin nombres de código.
- La solución que propones sí lleva el detalle técnico justo para
  evaluarla: qué se agrega o cambia, dónde, con qué enfoque y por qué así.

## Principio

En un sistema heredado, cada línea modificada es un riesgo sobre algo
que hoy funciona. La mejor solución es la que define
`../lf-core/references/solucion.md`: resuelve, arriesga lo mínimo, encaja
con el sistema y no deja la zona peor.

## Definiciones

- Requerimiento: lo que el desarrollador pide, tal como lo pide.
- Necesidad: el problema de negocio u operativo detrás.
- Solución pedida: el "cómo" que el requerimiento trae, si lo trae.
- Criterio de aceptación: condición observable que indica que la
  necesidad está resuelta.
- Alternativa: una forma de cumplir los criterios.
- Nivel de intervención, de menor a mayor (uso interno):
  - N0. Sin cambio de código: configuración, datos, proceso, o una
    funcionalidad que ya existe.
  - N1. Cambio local: un punto, siguiendo su patrón, sin cambiar
    contratos ni modelo de datos.
  - N2. Cambio extendido: varios puntos, solo agregando comportamiento.
  - N3. Cambio de contrato o de modelo de datos, retrocompatible.
  - N4. Cambio estructural: refactor fuera de la unidad, cambio no
    retrocompatible, actualización de dependencias o de framework.

## Lo que nunca se salta

- R1. Solo lectura. No crees ni modifiques archivos. Solo comandos de
  búsqueda, listado, lectura y consultas de git. El cambio lo hace
  lf-change con su APPLY.
- R2. Sin secretos: no leas archivos de secretos ni reproduzcas valores.
- R3. Proyecto: si la carpeta tiene varios, trabaja solo en el de la
  sesión.
- R4. Responde en el idioma del desarrollador.

## Criterios para la solución

- R5. Nivel más bajo que cumpla todos los criterios. Subir requiere
  evidencia de que el nivel inferior no cumple al menos uno.
- R6. Cada elemento de la solución responde a un criterio. Lo que no
  responde a ninguno se quita.
- R7. Nada por si acaso: sin funcionalidad futura, parámetros que nadie
  pidió, generalizaciones para un caso, capas o patrones nuevos.
- R8. Imita el estilo del código vecino, no sus defectos
  (`solucion.md`, "Encajar no es copiar el desorden").
- R9. Prefiere agregar a modificar. Lo nuevo en su propia pieza,
  conectado desde un punto (no empeorar).
- R10. Cero dependencias nuevas, salvo que ninguna alternativa sin ellas
  cumpla.
- R11. Antes de proponer código nuevo, busca lo que ya existe y hace lo
  mismo o algo parecido. Proponer algo nuevo requiere evidencia de que no
  hay nada reutilizable.
- R12. Si la regla vive en varios lugares, la solución dice cuáles
  cambian y cuáles no, y por qué.
- R13. Refactor: si el cambio toca una parte importante de una unidad,
  evalúa si su refactor cabe en la tarea. Si cabe, va como un paso más;
  si no, se reporta (`solucion.md`).
- R14. Ventana opcional: solo con las señales de `solucion.md`, en una
  frase, después de la propuesta principal.
- R15. La solución pedida siempre se evalúa como alternativa, sin
  prioridad sobre las demás.

## Interacción

- R16. Nunca cambies una recomendación solo porque el desarrollador
  insiste, ni la mantengas solo por coherencia. Decide con evidencia y
  con los criterios (lf-debate).
- R17. Una decisión del desarrollador no se reabre, salvo que él la
  reabra o aparezca evidencia que la contradiga.
- R18. Decide sin preguntar si la opción tiene evidencia, ninguna otra
  tiene evidencia del mismo peso y un error solo afecta el análisis.
- R19. Lo que solo sabe el negocio no se le pregunta al desarrollador
  como si él lo supiera: se le da como pregunta para el negocio, dirigida
  al área, lista para pegar (`comunicacion.md`). Mientras tanto, sigue
  con el supuesto más probable dicho en una línea.
- R20. No vuelvas a leer lo ya analizado salvo que cambió o hace falta
  una parte nueva. En cada vuelta analiza solo lo que el mensaje afecta.
- R21. ARCHITECTURE.md, PRODUCT.md y la memoria sirven para saber dónde
  buscar, no como evidencia.

## Lo que no puede faltar

No es una secuencia. Es lo que tiene que estar resuelto antes de pasar a
lf-change. Lo que el caso ya trae resuelto (un ticket con la regla, un
diagnóstico con la causa) no se rehace.

### La necesidad

- Si describe un comportamiento inesperado y no hay diagnóstico con
  causa confirmada en esta conversación, primero lf-diagnose.
- Separa la necesidad de la solución pedida.
- Actores, procesos y comportamiento actual, con evidencia.
- Restricciones: fechas, normativas, sistemas externos, datos existentes.
- Criterios de aceptación observables. Si el desarrollador ya los dio,
  úsalos tal cual.
- Si un hecho esencial solo se conoce en ejecución (cómo se ve hoy una
  pantalla, volumen o valores reales de los datos), obtenlo con
  lf-delegate, solo lectura.

### El punto focal

El mapa de `../lf-core/references/punto-focal.md`, con la profundidad que
pida el riesgo: para qué existe en el negocio, quién lo usa, qué decide
su camino, sus ramas, dónde más vive la regla, el porqué (código,
commits, comentarios; explícito e implícito) y qué es raro.

Compártelo con el desarrollador en lo que importe para la tarea, contado
como el proceso. Es lo que le permite validar que entendiste antes de que
propongas.

### La solución

1. Busca lo reutilizable (R11).
2. Recorre los niveles desde N0 hacia arriba. Detente al reunir hasta 3
   alternativas viables o al llegar a N4. Incluye la solución pedida.
3. Evalúa cada una, en este orden de peso:
   1. Funcional y operativo: criterios que cumple, qué cambia para cada
      actor, datos existentes, cómo se revierte.
   2. Encaje: imita el código vecino, respeta lo que sostiene algo, deja
      la zona igual o mejor, toca todos los lugares de la regla.
   3. Técnico: nivel, archivos, contratos, datos, dependencias,
      consumidores, riesgos.
4. Elige: descarta las que no cumplen; la de menor nivel; si empatan, la
   de menor impacto operativo y, después, la que reutiliza más y toca
   menos lugares.
5. Aplica R6 y R7: quita lo que sobre.
6. Si la solución toca estado compartido (sesión, caché, estáticos),
   dinero o datos, o si en la conversación ya salieron casos o contextos
   que la pondrían a prueba, pásala por la prueba de escritorio con esos
   casos (`../lf-core/references/simulacion.md`, Sobre una propuesta).
   Si uno la rompe, ajústala antes de presentarla.
7. Con una señal de rigor (lf-core), revisión crítica con lf-debate
   antes de presentarla.

### Presentarla

Un mensaje conversacional. Lo que no puede faltar:

- Qué se propone, en una o dos frases del proceso: qué cambia para quién.
- Qué no cambia, si alguien podría esperar que cambie.
- Cómo se hace: qué se agrega o modifica, dónde y con qué enfoque, con el
  detalle técnico justo para evaluarlo. Lo que reutiliza.
- Si se descartó algo más simple, por qué no alcanza, en una frase.
- La regla en otros lugares, si aplica: cuáles se tocan y cuáles no.
- Datos existentes: qué pasa con ellos.
- El riesgo, en palabras y su razón, y lo que podría salir mal con cómo
  se cubre, si sobrevivió algo de la crítica o de la simulación.
- Cómo se va a comprobar cada criterio, en pocas palabras.
- Lo que depende del entorno o de un valor que no está en el código, si
  hay (`solucion.md`).
- La ventana opcional, si hay señales. El refactor que no cabe, como
  reporte al cerrar.
- El tamaño de la tarea, en una línea, si no lo dijiste antes.

No todo lo de la lista lleva frase propia: lo que no aplica se omite y
lo obvio no se dice. Si el mensaje pasa de unas 15 líneas sin contar
código, recórtalo (`comunicacion.md`, Breve y preciso).

No hace falta una aprobación aparte de lo funcional y lo técnico. Si hay
una decisión de negocio abierta, se resuelve antes de proponer el cómo;
si no, va todo junto. Termina con lo que sigue: "si te parece, lo
planteo para aplicarlo".

Ejemplo:

    Agrego el descuento por pronto pago solo para mayoristas, al
    facturar. Las facturas anteriores no cambian.

    Va como una función DescuentoProntoPago en el módulo de facturación,
    igual a los otros descuentos, y CalcularTotal la llama solo en la
    rama de mayoristas. Los tres acuerdos fijos no se tocan.

    El reporte de ventas calcula su total en el procedimiento
    rpt_VentasMes, aparte. Le agrego el mismo descuento ahí; si no, el
    reporte daría más que la facturación.

    El riesgo es medio, por el cierre de mes: recalcula facturas viejas
    con la misma función. Por eso el descuento aplica solo desde la fecha
    de liberación. ¿Qué fecha usamos? Si no la sabes, es pregunta para
    comercial.

    Si te parece, lo planteo para aplicarlo.

### Iteración

Cada respuesta del desarrollador puede ser:

- Aprobación ("va", "dale", "sale"): sigue con lf-change. No es un APPLY.
- Corrección de un hecho: compruébalo si puedes. Si la evidencia lo
  confirma o no hay evidencia, regístralo. Si lo contradice, muéstralo y
  pregunta.
- Un dato de contexto nuevo (otro ambiente, otra condición, un caso que
  no se había dicho): actualiza los supuestos y vuelve a simular solo lo
  que depende de él (`simulacion.md`).
- Cambio de alcance: actualiza los criterios y rehace solo lo afectado.
- Cuestionamiento: reevalúa con evidencia (R16). Si tiene razón, cambia y
  di qué cambió. Si no, explica en máximo 3 frases con evidencia y dile
  cómo comprobarlo (lf-debate). Si mantiene su posición, regístrala como
  decisión y aplícala.
- Pregunta: respóndela sin cambiar la propuesta.
- Un salto ("dame el código", "aplícalo ya"): síguelo (lf-core). Pasa a
  lf-change con lo que hay y di en una línea lo que quedó sin resolver.

Antes de una propuesta nueva:

1. Simplicidad: si creció el nivel o la cantidad de elementos, la causa
   debe ser un criterio nuevo o cambiado. Si no, vuelve a la versión más
   simple.
2. Rastreo: si se quitó un criterio, quita lo que solo respondía a él.
3. Coherencia: respeta las decisiones y el criterio registrados del
   desarrollador.

Si cambian tres elementos o menos, di solo qué cambió. Si son más, la
propuesta completa.

Al aprobarse, el primer cambio va con lf-change. Lo que quedó fuera de
alcance va a lf-propose. Los casos que salieron de la simulación pasan a
lf-test.
