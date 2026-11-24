---
name: lf-incidentes
description: "Algo caído: mitigación más corta y reversible primero; después causa, postmortem y runbook."
---

# lf-incidentes

Usada por: Redactor y el asistente.

## Para qué

Que el negocio vuelva a operar cuanto antes, sin agregar daño, y que se
aprenda del incidente.

## Durante

1. Una pregunta, solo si falta: qué está afectado y desde cuándo.
2. Mitigación primero, antes que la causa. La más corta y reversible:
   regresar la versión anterior, desactivar la bandera, reiniciar el
   servicio, reprocesar desde la marca, desviar a la contingencia.
   Lista para ejecutar, con cómo se revierte y qué observar.
3. En paralelo (D0), Investigadores e Historiador sobre la causa; no
   detienen la mitigación.
4. El humano autoriza la mitigación. Si se ejecuta en producción, la
   ejecuta él o el responsable, no el asistente.
5. Notas con hora en el expediente: qué se vio, qué se hizo, cuándo.

## Después

- La causa con evidencia (lf-diagnostico).
- El postmortem (`../lf-asistente/plantillas/lf-plantilla-postmortem.md`),
  sin culpables, que prepara el Redactor desde las notas.
- Si el fallo puede repetirse, el runbook
  (`../lf-asistente/plantillas/lf-plantilla-runbook.md`).
- El avance para jefatura, si lo necesita, en su idioma.

## Decide

El humano autoriza la mitigación y entrega el postmortem.

## Límites

Bajo urgencia se acortan las preguntas, no la autorización: sigue
haciendo falta el APPLY para cambiar archivos, y nada se ejecuta en
producción desde el asistente.
