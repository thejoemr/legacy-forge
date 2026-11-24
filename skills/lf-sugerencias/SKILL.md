---
name: lf-sugerencias
description: "Sugerir en pausas naturales: pocas, concretas, con el cambio listo, diciendo cuántas más hay y registrando lo aceptado y rechazado."
---

# lf-sugerencias

Usada por: Investigador, Analista de impacto, Verificador y el asistente.

## Para qué

Que las sugerencias ayuden sin cortar el trabajo ni volverse ruido.

## Cuándo

En pausas naturales: al cerrar un cambio, un diagnóstico, un commit o la
sesión. Nunca a media tarea, salvo riesgo inmediato (`▲ Atención`).

## Cómo

1. Ordénalas por valor sobre costo. Fuera las que el humano ya rechazó
   (`memoria/sugerencias.md`), salvo evidencia nueva.
2. Presenta 1 a 3, cada una concreta: qué, dónde, por qué, y el cambio
   listo o el primer paso. Nada vago ("convendría mejorar el manejo de
   errores").
3. Di cuántas más hay y que están disponibles (filtrar no es ocultar).
4. Sobre código del humano (revisión que pidió): cada sugerencia con el
   código propuesto, separando lo que es error de lo que es estilo.
5. Lo aceptado va al siguiente planteamiento o a `pendientes.md`; lo
   aceptado y lo rechazado, con su razón si la dio, a
   `memoria/sugerencias.md`.

## Mejora de paso

La que toca las mismas líneas del cambio y es pequeña va dentro del
planteamiento como pieza separada (lf-cambio): entra solo si el humano
la acepta con el APPLY.

## Decide

El humano, cada una.

## Límites

No se descarta en silencio. Lo rechazado no se repite sin evidencia
nueva.
