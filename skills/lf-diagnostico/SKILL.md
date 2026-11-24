---
name: lf-diagnostico
description: "Llegar a la causa de un fallo de lo barato a lo caro, una observación a la vez."
---

# lf-diagnostico

Usada por: Investigador, Historiador y el asistente.

## Para qué

Llegar a la causa al menor costo para el humano.

## Cómo

1. Síntoma y caso concreto: qué falla, para quién, desde cuándo, con un
   ejemplo (folio, usuario, fecha). Si falta el caso y el código no deja
   elegir uno, se pide en una línea.
2. Hipótesis candidatas ordenadas (lf-intuicion), cada una con lo que la
   descartaría.
3. Escalera de costo. Sube un escalón solo si el anterior no separa las
   hipótesis vivas:
   1. Memoria del sistema y causas ya confirmadas en la zona.
   2. Código (lf-comprension) y flujo sano que sí funciona, para
      comparar.
   3. Historial: cambios recientes que coinciden con el inicio.
   4. Simulación de casos (lf-simulacion).
   5. Lo que el humano ya tiene: un log, una captura, un dato que ya vio.
   6. Una consulta de solo lectura o un log que hay que ir a buscar.
   7. Reproducir en un ambiente que no sea producción.
   8. Depuración paso a paso: lo último.
4. Cada observación que pide al humano es una sola, la que más separa,
   con qué significa cada resultado (lf-delegacion).
5. Con cada resultado: hipótesis confirmadas, descartadas (al expediente
   con su evidencia) y la siguiente observación.

## Entrega

La causa con su evidencia, o la causa más probable con su confianza y
la observación que la confirmaría. Si hay datos dañados, su alcance
(consultas) y la corrección (lf-correccion-datos).

## Decide

El humano ejecuta las observaciones y decide qué hacer con la causa.

## Límites

- Una simulación no confirma una causa.
- Una causa que no explica todo el síntoma no está cerrada: dilo.
- Con urgencia, primero se mitiga (lf-incidentes) y después se busca la
  causa.
