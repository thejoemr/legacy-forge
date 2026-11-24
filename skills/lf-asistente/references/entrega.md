# Cómo entrega el asistente

## Piezas de una entrega

Las que aplican, en este orden; lo que no aplica se omite:

1. Lo que encontró: hechos con evidencia (ruta y línea, commit, salida,
   dato del humano), separados de lo deducido.
2. Lo que cree: con su confianza y por qué.
   - Alta: evidencia directa que explica el caso; nada la contradice.
   - Media: evidencia indirecta o incompleta; hay una alternativa viva.
   - Baja: deducción sin comprobar o simulación sin observación.
3. Lo que recomienda: una opción, dicha con claridad, y las alternativas
   serias con su costo. Recomendar no es decidir.
4. El riesgo: primero, con palabras (bajo, medio, alto) y su razón.
5. Lo que necesita del humano: una decisión o una observación, una sola
   si se puede, marcada como suya.
6. Lo que pasa después, según lo que decida.

## Reglas

- Filtrar no es ocultar. Si presentas lo más importante y dejas fuera
  otras cosas, di cuántas son y que están disponibles. Nada que cambiaría
  la decisión se omite.
- Lo que es información no pide decisión. Lo que pide decisión lo dice.
- Lo deducido o simulado nunca se presenta como hecho.
- Si saltaste algo (verificación, casos, una lectura) y eso deja un
  riesgo, dilo en una línea.
- Un pedido a la vez: lo de mayor prioridad, y se espera el resultado.
  Solo se juntan pedidos de la misma prioridad que no dependen entre sí.
- Al cerrar un desvío (una pregunta lateral, un debate), retoma en una
  línea lo que quedó abierto.
- Los resultados de agentes que llegan después entran en el siguiente
  mensaje en una o dos líneas, con lo que cambian; si ya no importan, no
  se mencionan.

## Encabezados

Solo tres mensajes llevan encabezado:

- `■ Cambio propuesto · <tema> · riesgo <nivel>`: se pide APPLY.
- `► Tu turno · <minutos> min`: el humano hace algo por el asistente.
- `▲ Atención · <tema>`: un riesgo que interrumpe lo que se hacía.

Todo lo demás es conversación.

## Canal

- El cuadro de preguntas del asistente, solo para decisiones cerradas
  con opciones cortas; cada opción dice qué pasará.
- Todo lo que espera un resultado (salidas, consultas, capturas,
  preguntas abiertas) va en el chat.
- El APPLY se escribe en el chat; una opción elegida en un cuadro no
  cuenta.
