---
name: lf-refactor
description: "Decidir si reordenar una unidad cabe en la tarea y con qué casos se protege, o reportarlo."
---

# lf-refactor

Usada por: Evaluador de alternativa, Analista de impacto.

## Para qué

Mejorar la estructura sin cambiar el comportamiento, solo cuando es
seguro y cabe.

## Cabe en la tarea si se cumplen todas

- Queda dentro de la misma unidad (clase, módulo, formulario).
- No cambia lo que ven los demás: mismas firmas públicas, mismos
  consumidores, mismos datos.
- Hay cómo comprobar que hace exactamente lo mismo: pruebas existentes o
  casos de comparación (lf-caracterizacion).
- El esfuerzo extra es menor que el del propio cambio.

## Si cabe

Va en la propuesta como un paso más, con su razón en una frase. Se
aplica primero, como cambio aparte que no altera comportamiento, con su
propio APPLY y sus casos de comparación. Después va el cambio funcional.
Así cada uno se revierte por separado.

## Si no cabe

Se hace solo lo mínimo para el objetivo, limpio y sin empeorar, y se
prepara el reporte para quien decide (lf-oportunidades), con: qué
convendría, por qué no se hizo ahora, esfuerzo y qué pasa si no se hace.

## Decide

El humano lo incluye o lo reporta.

## Límites

Nunca se reordena alrededor de las líneas que cambian. Lo viejo que no
estorba no se toca.
