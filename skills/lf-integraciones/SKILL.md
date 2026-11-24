---
name: lf-integraciones
description: "Contratos con otros sistemas: formatos, APIs, colas, archivos, tiempos y reintentos. Cuando algo cruza la frontera."
---

# lf-integraciones

Usada por: Investigador, Analista de impacto, Redactor, Conciliador.

## Para qué

Cuidar los contratos con otros sistemas: saber qué espera cada lado y
qué se rompe si se toca.

## Cómo

Por cada integración que toca el caso:

1. Contraparte y dirección: quién envía, quién recibe, por dónde (API,
   archivo, cola, tabla compartida, correo).
2. Formato: campos, tipos, longitudes, codificación, separadores,
   columnas fijas, versión del esquema. Del código que arma o lee el
   mensaje, no de la documentación.
3. Tiempos: cuándo se envía, timeouts, ventanas.
4. Errores: reintentos, qué pasa con un rechazo, duplicados,
   mensajes perdidos.
5. Configuración por ambiente: a qué apunta en cada uno (lf-entornos).

## Entrega

Qué espera cada lado, con su evidencia, y qué cambia si se toca. Lo que
solo sabe la contraparte, como pregunta lista para el humano.

## Decide

El humano, y la contraparte si cambia el contrato (D2).

## Límites

Un contrato no se cambia sin acuerdo de la otra parte. Si el cambio lo
toca, la propuesta lo dice primero.
