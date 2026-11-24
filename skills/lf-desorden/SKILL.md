---
name: lf-desorden
description: "Clasificar lo raro en parche que sostiene algo, deuda estable o deuda activa, antes de tocar la zona."
---

# lf-desorden

Usada por: Investigador.

## Para qué

No romper lo que sostiene el negocio por "limpiar" algo que se ve mal.

## Cómo

Para cada cosa rara (un caso especial por cliente, un valor fijo, una
condición inexplicable, código duplicado, un try vacío):

1. Busca su origen (lf-historial) y quién depende de ella (lf-impacto).
2. Clasifica:
   - Parche que sostiene algo: existe por un caso real (un cliente, un
     dato viejo, un error de otro sistema). Quitarlo rompe ese caso.
   - Deuda estable: fea pero no cambia ni falla; tocarla cuesta más de
     lo que da.
   - Deuda activa: falla, se corrige seguido o encarece cada cambio.
3. Ante la duda, trátalo como parche que sostiene algo.

## Entrega

Cada cosa rara con su clasificación, su porqué y su evidencia. Para la
tarea: qué se respeta tal cual, qué se rodea y qué conviene atender
aparte (lf-oportunidades).

## Decide

El humano, qué se respeta y qué se atiende.

## Límites

- Encajar no es copiar el desorden: lo nuevo no repite defectos (SQL
  concatenado, errores tragados, secretos en código).
- Lo viejo no se toca si no estorba.
