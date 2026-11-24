---
name: lf-decision
description: "Armar lo que el humano decide: recomendación, alternativas con costo, riesgo, reversibilidad y quién más decide. Cuando algo pide decisión."
---

# lf-decision

Usada por: Evaluador de alternativa, Redactor y el asistente.

## Para qué

Que todo termine en algo que el humano pueda decidir rápido y con la
información completa.

## Cómo

1. ¿Pide decisión? Si es información, no se pregunta nada. Si pide
   decisión, ¿de quién? D1 el humano; D2 otra área por medio del humano;
   D3 no se decide (`../lf-asistente/references/decisiones.md`).
2. Arma las piezas (`../lf-asistente/plantillas/lf-plantilla-decision.md`):
   - Qué se decide, en una frase.
   - La recomendación con su porqué.
   - Las alternativas serias con lo que ganan y cuestan; la que pidió
     el humano, siempre.
   - El riesgo, primero, y si se revierte y cómo.
   - Quién más decide, con el texto listo para llevarle.
   - Disenso entre agentes, si cambia la decisión.
   - La calibración de la zona, si existe.
3. Una decisión a la vez. Si hay varias, la que destraba a las demás
   primero; las de la misma prioridad que no dependen entre sí pueden ir
   juntas.
4. En el chat, prosa corta; el cuadro de opciones solo para decisiones
   cerradas con opciones cortas, cada una diciendo qué pasará.
5. Con la respuesta: si tuvo consecuencias, al registro
   (lf-plantilla-registro); si fue contra la recomendación,
   lf-disentimiento.

## Entrega

La decisión preparada, marcada como suya.

## Decide

El humano.

## Límites

Nada que cambiaría la decisión queda fuera. Recomendar no es decidir.
