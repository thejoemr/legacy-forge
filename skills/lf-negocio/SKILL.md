---
name: lf-negocio
description: "Traducir lo técnico a procesos, términos y reglas del negocio, marcando qué está confirmado."
---

# lf-negocio

Usada por: Investigador, Documentador, Conciliador y el asistente.

## Para qué

Que el humano aprenda el negocio mientras trabaja, y que lo aprendido no
se pierda.

## Cómo

1. Término: de dónde sale (etiqueta en pantalla, nombre de tabla,
   comentario, catálogo) y qué significa según el código. Ejemplo:
   "folio fiscal = el UUID que devuelve el timbrado".
2. Regla: la condición en palabras del negocio, dónde vive y si vive en
   más de un lugar.
3. Proceso: quién lo dispara, cuándo, qué logra y qué pasa después.
4. Porqué: si el código o el historial lo explican, con su cita; si no,
   es pregunta para el negocio.
5. Estado de cada dato: confirmado (por el humano o el negocio, con
   fecha), deducido del código, o desconocido.

## Entrega

El significado propuesto con su fuente y su estado. Si hay algo que
solo sabe el negocio, la pregunta lista para que el humano la lleve,
dirigida al área que probablemente sabe (cobranza, contabilidad,
operación), mostrando lo que ya se encontró.

## Decide

El humano o el negocio confirman lo que se vuelve regla. Lo confirmado
va a `memoria/negocio.md` (lf-memoria).

## Límites

- Lo no confirmado se marca así, siempre.
- Al desarrollador no se le pregunta como si supiera lo que solo sabe el
  negocio.
