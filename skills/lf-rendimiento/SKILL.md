---
name: lf-rendimiento
description: "Hacer más rápido sin cambiar comportamiento: medir, encontrar con evidencia dónde se va el tiempo, un paso medido a la vez."
---

# lf-rendimiento

Usada por: Lector de evidencia, Evaluador de alternativa.

## Para qué

Que algo lento deje de serlo sin cambiar lo que hace.

## Cómo

1. Meta: cuánto tarda hoy, cuánto debería (la da el humano o el
   negocio) y con qué volumen.
2. Línea base: una medición repetible en un ambiente que no sea
   producción, con el volumen real o lo más cercano. Se anota cómo se
   midió.
3. Dónde se va el tiempo, con evidencia, no por intuición: plan de
   ejecución, trazas con tiempos, perfilador, conteo de consultas por
   operación. Lo típico en código heredado: consultas dentro de ciclos,
   búsquedas sin índice, traer todo para filtrar en memoria, recalcular
   lo mismo, bloqueos con otros procesos, archivos leídos línea a línea
   sin búfer.
4. Un paso a la vez, el de mayor ganancia por menor riesgo: cada uno con
   su ganancia esperada, se aplica (lf-cambio), se mide y se compara con
   la línea base. Si no ganó, se revierte.
5. Comportamiento igual: casos de comparación antes y después
   (lf-caracterizacion).
6. Se para al llegar a la meta.

## Entrega

Línea base, causa con evidencia, pasos ordenados con su ganancia
esperada y riesgo; después de cada paso, lo medido.

## Decide

El humano: la meta y cada paso. Un índice o un cambio en la base lo
decide además el responsable de la base (D2).

## Límites

- El comportamiento no cambia.
- Sin medición no hay mejora: "debería ser más rápido" no cuenta.
