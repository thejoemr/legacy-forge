---
name: lf-batch
description: "Procesos programados: orden, dependencias, correr dos veces, cómo reanudar. Cuando un job falla o hay que reprocesar."
---

# lf-batch

Usada por: Investigador, Conciliador.

## Para qué

Entender un proceso por lotes lo bastante para saber por qué falló y
cómo reanudarlo sin duplicar ni perder datos.

## Cómo

1. Dónde se programa: crontab, tareas de Windows, agente de SQL, JCL,
   orquestador. Horario y qué lo dispara.
2. Pasos en orden y dependencias: qué espera a qué, qué archivos o
   tablas deja cada paso para el siguiente.
3. Por cada paso: qué lee, qué escribe, si hace commit parcial o todo al
   final, si deja marcas de avance.
4. Correr dos veces: ¿duplica, sobrescribe o detecta lo ya procesado?
   (idempotencia).
5. Reanudar: desde dónde se puede, qué hay que limpiar antes, qué marca
   usar; o si hay que correr todo.
6. Ventana: cuánto tarda, qué corre al mismo tiempo, qué depende de que
   termine a tiempo.

## Entrega

La causa de la falla con evidencia, el estado en que quedó cada paso
(consultas de solo lectura para confirmarlo) y el procedimiento
propuesto para reanudar o reprocesar, con lo que se verifica después.

## Decide

El humano u operación reanudan.

## Límites

No se corre ni se reanuda nada por cuenta propia. Lo que escribe en
datos reales lo ejecuta el responsable.
